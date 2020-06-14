/* eslint-disable max-len */
const passport = require('passport');
const refresh = require('passport-oauth2-refresh');
const moment = require('moment');

const LocalStrategy = require('./strategies/local');
const FacebookStrategy = require('./strategies/facebook');
const GoogleStrategy = require('./strategies/google');

const User = require('../mongoose/models/User');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

/**
 * Sign in using Email and Password.
 */
passport.use(LocalStrategy);

/**
 * OAuth Strategy Overview
 *
 * - User is already logged in.
 *   - Check if there is an existing account with a provider id.
 *     - If there is, return an error message. (Account merging not supported)
 *     - Else link new OAuth account with currently logged-in user.
 * - User is not logged in.
 *   - Check if it's a returning user.
 *     - If returning user, sign in and we are done.
 *     - Else check if there is an existing account with user's email.
 *       - If there is, return an error message.
 *       - Else create a new account.
 */

/**
 * Sign in with Facebook.
 */
passport.use(FacebookStrategy);
// // instagram now uses facebook

// /**
//  * Sign in with Google.
passport.use('google', GoogleStrategy);
refresh.use('google', GoogleStrategy);

/**
 * Login Required middleware.
 */
exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(403).send();
};

/**
 * Authorization Required middleware.
 */
exports.isAuthorized = (req, res, next) => {
  const provider = req.path.split('/')[2];
  const token = req.user.tokens.find((token) => token.kind === provider);
  if (token) {
    // Is there an access token expiration and access token expired?
    // Yes: Is there a refresh token?
    //     Yes: Does it have expiration and if so is it expired?
    //       Yes, Quickbooks - We got nothing, redirect to res.redirect(`/auth/${provider}`);
    //       No, Quickbooks and Google- refresh token and save, and then go to next();
    //    No:  Treat it like we got nothing, redirect to res.redirect(`/auth/${provider}`);
    // No: we are good, go to next():
    if (
      token.accessTokenExpires &&
      moment(token.accessTokenExpires).isBefore(moment().subtract(1, 'minutes'))
    ) {
      if (token.refreshToken) {
        if (
          token.refreshTokenExpires &&
          moment(token.refreshTokenExpires).isBefore(moment().subtract(1, 'minutes'))
        ) {
          res.redirect(`/auth/${provider}`);
        } else {
          refresh.requestNewAccessToken(
            `${provider}`,
            token.refreshToken,
            (err, accessToken, refreshToken, params) => {
              User.findById(req.user.id, (err, user) => {
                user.tokens.some((tokenObject) => {
                  if (tokenObject.kind === provider) {
                    tokenObject.accessToken = accessToken;
                    if (params.expires_in)
                      tokenObject.accessTokenExpires = moment()
                        .add(params.expires_in, 'seconds')
                        .format();
                    return true;
                  }
                  return false;
                });
                req.user = user;
                user.markModified('tokens');
                user.save((err) => {
                  if (err) console.log(err);
                  next();
                });
              });
            },
          );
        }
      } else {
        res.redirect(`/auth/${provider}`);
      }
    } else {
      next();
    }
  } else {
    res.redirect(`/auth/${provider}`);
  }
};

module.exports = passport;
