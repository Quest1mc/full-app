/* eslint-disable no-undef */

/* eslint-disable no-unused-vars */

/**
 * Module dependencies.
 */
const { loadNuxt, build } = require('nuxt');
const express = require('express');
const ExpressGraphQL = require('express-graphql');
const compression = require('compression');
const session = require('express-session');
const bodyParser = require('body-parser');
const chalk = require('chalk');
const dotenv = require('dotenv');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');

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
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
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
app.disable('x-powered-by');

api(app);

app.use(
  '/graphql',
  ExpressGraphQL({
    schema,
    graphiql: true,
  }),
);

app.listen(3128);
// ----------------------Express cronjob ends ------------------------//

/**
 * Error Handler.
 */
if (process.env.NODE_ENV === 'development') {
  // only use in development
  // app.use(errorHandler());
} else {
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('Server Error');
  });
}

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
})();

module.exports = app;
