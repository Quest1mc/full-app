/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-undef */

/* eslint-disable no-unused-vars */

/**
 * Module dependencies.
 */
const { loadNuxt, build } = require('nuxt');
const express = require('express');

const xhub = require('express-x-hub');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const ExpressGraphQL = require('express-graphql');
const compression = require('compression');
const session = require('express-session');
const flash = require('express-flash');
const cron = require('node-cron');

const chalk = require('chalk');
const dotenv = require('dotenv');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const User = require('./config/mongoose/models/User');
const axios = require('axios');
const qs = require('qs');

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.config({ path: '.env' });

const passport = require('./config/passport');
const api = require('./config/api');
const schema = require('./config/graphql');

/**
 * Create Express server.
 */
const app = express();

/**
 * Connect to MongoDB.
 */
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('error', (err) => {
  console.error(err);
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
  process.exit();
});

// ____________________express stuff _______________________________________________________________

/**
 * Express configuration.
 */
app.set('host', process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0');
app.set('port', process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080);
app.use(xhub({ algorithm: 'sha1', secret: process.env.FACEBOOK_SECRET }));

app.use(compression());

app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: 1209600000 }, // two weeks in milliseconds
    store: new MongoStore({
      url: process.env.MONGODB_URI,
      autoReconnect: true,
    }),
  }),
);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.disable('x-powered-by');

api(app);
// ------------------facebook and insta webhooks starts  ---------------------------//
/**
 * FB, Instagram Webhook configuration.
 */
const fbAppSecret = process.env.FACEBOOK_SECRET || 'secret';
const token = process.env.FBWEBTOKEN || 'heythis2020june';
const receivedUpdates = [];
app.use(xhub({ algorithm: 'sha1', secret: fbAppSecret }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride());

// app.use(lusca.xframe('SAMEORIGIN'));
// app.use(lusca.xssProtection(true));
// app.disable('x-powered-by');
// app.use((req, res, next) => {
//   res.locals.user = req.user;
//   next();
// });

app.get('/auth/instagram', (req, res) => {
  const clientId = process.env.INSTAGRAM_ID;
  const redirectUri = process.env.INSTAGRAM_ID_URI;
  res.redirect(
    `https://api.instagram.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user_profile,user_media&response_type=code`,
  );
});
app.get('/auth/instagram/callback', (req, res) => {
  // console.log('this is the code', req.query.code);

  const { code } = req.query;
  const clientId = process.env.INSTAGRAM_ID;
  const clientSecret = process.env.INSTAGRAM_SECRET;

  console.log('this is the code ', code);
  const redirectUri = process.env.INSTAGRAM_ID_URI;
  const url = 'https://api.instagram.com/oauth/access_token';

  const body = {
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: 'authorization_code',
    redirect_uri: redirectUri,
    code,
  };

  request({
    method: 'POST',
    uri: 'https://api.instagram.com/oauth/access_token',
    body: qs.stringify(body),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  }).then((response) => {
    const accessToken = response.access_token;
    console.log('RESPonse', response.access_token);
    if (req.user) {
      User.findById(req.user.id, (err, user) => {
        if (err) {
          return err;
        }
        // user.instagram = profile.id;
        user.tokens.push({ kind: 'instagram', accessToken });
        // user.profile.name = user.profile.name || profile.displayName;
        // user.profile.picture = user.profile.picture || profile._json.data.profile_picture;
        // user.profile.website = user.profile.website || profile._json.data.website;
        user.save((err) => {
          req.flash('info', { msg: 'Instagram account has been linked.' });
          console.log(err, user);
        });
      });
    }
  });
});
// });

app.get(
  '/auth/facebook',
  passport.authenticate('facebook', { scope: ['email', 'public_profile', 'manage_pages'] }),
);
app.get(
  '/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect(req.session.returnTo || '/');
  },
);

app.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: [
      'profile',
      'email',
      'https://www.googleapis.com/auth/youtube.readonly',
      // 'https://www.googleapis.com/auth/spreadsheets.readonly',
    ],
    accessType: 'offline',
    prompt: 'consent',
  }),
);
app.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect(req.session.returnTo || '/');
  },
);

/**
 * Facebook instagram webhook endpoints
 */
app.get('/fbwebhook', (req, res) => {
  console.log('FB Webhook data');
  res.status(200).send(JSON.stringify(receivedUpdates, null, 2));
});

app.get(['/facebook', '/instagram'], (req, res) => {
  console.log('facebook, instagram verify');
  if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === token) {
    res.send(req.query['hub.challenge']);
  } else {
    res.status(400).send();
  }
});

app.post('/facebook', (req, res) => {
  console.log('Facebook request body:', JSON.stringify(req.body));
  // console.log('This is the response', JSON.stringify(req.body.entry[0].changes));
  if (!req.isXHubValid()) {
    console.log('Warning - request header X-Hub-Signature not present or invalid');
    res.status(401).send();
    return;
  }

  console.log('request header X-Hub-Signature validated');
  // Process the Facebook updates here
  receivedUpdates.unshift(req.body);
  // console.log(req.body);
  // console.log(res);
  res.status(200).send();
});

app.post('/instagram', (req, res) => {
  // console.log('Instagram request body:');
  // console.log(req.body);
  console.log('Instagram request body:', JSON.stringify(req.body));
  // Process the Instagram updates here
  if (!req.isXHubValid()) {
    console.log('Warning - request header X-Hub-Signature not present or invalid');
    res.status(401).send();
    return;
  }
  console.log('request header X-Hub-Signature validated');
  receivedUpdates.unshift(req.body);
  console.log(receivedUpdates);
  res.status(200).send();
});
// ----------------------YOUTUBE CRON TASK STARTS HERE ------------------------//

const API_URL = 'https://www.googleapis.com/youtube/v3/channels';
const { GOOGLE_ID, GOOGLE_SECRET, GOOGLE_YOUTUBE_API_KEY } = process.env;

/**
 * Youtube scheduler api authenticator
 */
const youtubeAccessTokenByRefresh = async (refreshToken) => {
  console.log('calling token refresh', refreshToken);

  const requestBody = {
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: GOOGLE_ID,
    client_secret: GOOGLE_SECRET,
  };

  const url = 'https://oauth2.googleapis.com/token';

  return axios
    .post(url, qs.stringify(requestBody))
    .then((res) => {
      console.log('returning token response');
      return res.data;
    })
    .catch((error) => {
      console.error('an error occurred while trying to perform token refresh - ', error);
    });
};

/**
 * Youtube scheduler main function
 */
const getChannelInfoById = async (refreshToken) => {
  console.log('task started');
  console.log('calling fetch channel info');

  // pass refresh token and receive access token to call youtube api
  const tokenResponse = await youtubeAccessTokenByRefresh(refreshToken);
  const accessToken = tokenResponse.access_token;

  const auth = `Bearer ${accessToken}`;
  const headers = {
    'Content-Type': 'application/json',
    Authorization: auth,
  };

  const url = `${API_URL}?part=id,snippet,contentDetails,statistics&mine=true&key=${GOOGLE_YOUTUBE_API_KEY}`;

  return axios
    .get(url, {
      headers,
    })
    .then((res) => {
      console.log('return youtube response ');
      return res.data;
    })
    .catch((error) => {
      console.error('an error occurred - ', error);
    });
};

/**
 * saving to db, or any other cron logic goes here
 */
const mainCronTask = async () => {
  console.log('task started');
  console.log('calling fetch channel info');

  // read latest user document from mongodb
  User.find()
    .sort({ _id: -1 })
    .limit(1)
    .exec(async (err, users) => {
      // find token object from latest user document
      const token = users[0].tokens.find((item) => item.kind === 'google');

      // if google token is available continue with the rest
      if (token) {
        // pass resfresh token to method getChannelInfoById
        const youtubeResponse = await getChannelInfoById(token.refreshToken);
        console.log('YOUTUBE RESPONSE -', JSON.stringify(youtubeResponse));

        // implement the rest of the logic as you want
      } else {
        console.error('no youtube refresh token found');
      }
    });
};

/**
 * Youtube scheduler
 */
cron.schedule(
  '*/59 23 * * *',
  () => {
    console.log('running a task every 1 minutes');
    mainCronTask()
      .then(() => {
        console.log('task completed');
      })
      .catch((e) => {
        console.log(`task ended with an error ${e}`);
      });
  },
  {
    scheduled: true,
  },
);
// ------------------youtube cronjob ends---------------------------//

// app.listen(3128);
// ----------------------Express cronjob ends ------------------------//

/**
 * Error Handler.
 */
if (process.env.NODE_ENV === 'development') {
  // only use in development
  app.use(errorHandler());
} else {
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('Server Error');
  });
}
app.use(
  '/graphql',
  ExpressGraphQL({
    schema,
    graphiql: true,
  }),
);

/**
 * Start Express server.
 */
// app.listen(app.get('port'), () => {
//   console.log(
//     '%s App is running at http://localhost:%d in %s mode',
//     chalk.green('✓'),
//     app.get('port'),
//     app.get('env'),
//   );
//   console.log('  Press CTRL-C to stop\n');
// });

(async function start() {
  // We get Nuxt instance
  const nuxt = await loadNuxt(app.get('env') === 'development' ? 'dev' : 'start');

  // Render every route with Nuxt.js
  app.use(nuxt.render);

  // Build only in dev mode with hot-reloading
  if (app.get('env') === 'development') {
    build(nuxt);
  }
  // Listen the server
  /**
   * Start Express server.
   */
  app.listen(app.get('port'), () => {
    console.log(
      '%s App is running at http://localhost:%d in %s mode',
      chalk.green('✓'),
      app.get('port'),
      app.get('env'),
    );
    console.log('  Press CTRL-C to stop\n');
  });
  // app.use(xhub({ algorithm: 'sha1', secret: process.env.APP_SECRET }));
  // app.use(bodyParser.json());
  // app.use(methodOverride());
})();

module.exports = app;
