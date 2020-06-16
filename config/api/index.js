const request = require('request-promise');
const qs = require('querystring');

const passport = require('passport');
const axios = require('axios');

const userController = require('./controllers/user');
const User = require('../mongoose/models/User');

module.exports = (app) => {
  app.post('/login', userController.postLogin);
  app.get('/auth/logout', userController.logout);
  app.post('/signup', userController.postSignup);

  app.get('/auth/instagram', (req, res) => {
    const clientId = process.env.INSTAGRAM_ID;
    const redirectUri = `${process.env.BASE_URL}/auth/instagram/callback`;
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

    const body = {
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'authorization_code',
      redirect_uri: `${process.env.BASE_URL}/auth/instagram/callback`,
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
      // eslint-disable-next-line camelcase
      const { access_token, user_id } = JSON.parse(response);
      console.log('RESPonse', response);
      // eslint-disable-next-line camelcase
      const accessToken = access_token;
      console.log('ACCESS_TOKEN', accessToken, typeof response);
      const getLongLivedToken = ` https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${clientSecret}&access_token=${accessToken}`;
      const { longLivedToken, expiresIn } = axios.get(getLongLivedToken).then((response) => {
        console.log('this is the longlived token', response.data);
        const { access_token: longLivedToken, expires: expiresIn } = response.data;
        console.log('this is the long lived token', longLivedToken, expiresIn);
        User.findById(req.user.id, (err, user) => {
          if (err) {
            return err;
          }
          // eslint-disable-next-line camelcase
          user.profile.instagram = user_id;
          user.tokens.push({
            kind: 'instagram',
            longLivedToken,
            expiresIn,
          });
          console.log('this is longlived pushed');
          user.save((err) => {
            console.log('successfully added longlivedtoken');
          });
        });

        // user.token.instagram.longLivedToken = longLivedToken;
        // user.token.instagram.expiresIn = expires;
      });
      console.log('this is the long lived token 2nd line', longLivedToken, expiresIn);
      User.findById(req.user.id, (err, user) => {
        if (err) {
          return err;
        }
        // eslint-disable-next-line camelcase
        user.profile.instagram = user_id;
        user.tokens.push({
          kind: 'instagram',
          accessToken: access_token,
          instagramId: user_id,
          longLivedToken,
          expiresIn,
        });
        console.log('this is after push');
        // console.log('ACCESS_TOKEN', accessToken, typeof (response));
        user.save((err) => {
          // req.flash('info', { msg: 'Instagram account has been linked.' });
          res.redirect('/');
        });
      });
    });
  });
  // });

  app.get(
    '/auth/facebook',
    passport.authenticate('facebook', {
      scope: ['email', 'public_profile', 'manage_pages'],
    }),
  );
  app.get(
    '/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    (req, res) => {
      res.redirect('/');
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
      res.redirect('/');
    },
  );
};
