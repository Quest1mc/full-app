const passport = require('passport');
const validator = require('validator');

const User = require('../../mongoose/models/User');

/**
 * GET /login
 * Login page.
 */
exports.getLogin = (req, res) => {
  if (req.user) {
    return res.redirect('/');
  }
  res.render('account/login', {
    title: 'Login',
  });
};

/**
 * POST /login
 * Sign in using email and password.
 */
exports.postLogin = (req, res, next) => {
  const validationErrors = [];

  if (!validator.isEmail(req.body.email))
    validationErrors.push('Please enter a valid email address.');
  if (validator.isEmpty(req.body.password)) validationErrors.push('Password cannot be blank.');

  if (validationErrors.length) {
    return res.status(422).json(validationErrors);
  }

  req.body.email = validator.normalizeEmail(req.body.email, { gmail_remove_dots: false });

  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(401).json(['Email and/or password incorrect']);
    }

    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }

      res.status(200).json(user);
    });
  })(req, res, next);
};

/**
 * POST /signup
 * Create a new local account.
 */
exports.postSignup = (req, res, next) => {
  const validationErrors = [];
  if (!validator.isEmail(req.body.email))
    validationErrors.push('Please enter a valid email address.');
  if (!validator.isLength(req.body.password, { min: 8 }))
    validationErrors.push('Password must be at least 8 characters long');
  if (req.body.password !== req.body.confirmPassword)
    validationErrors.push('Passwords do not match');

  if (validationErrors.length) {
    return res.status(422).json(validationErrors);
  }

  req.body.email = validator.normalizeEmail(req.body.email, { gmail_remove_dots: false });

  const user = new User({
    email: req.body.email,
    password: req.body.password,
    name: req.body.name,
  });

  User.findOne({ email: req.body.email }, (err, existingUser) => {
    if (err) {
      return next(err);
    }

    if (existingUser) {
      return res.status(422).json(['Account with that email address already exists.']);
    }

    user.save((err) => {
      if (err) {
        return next(err);
      }

      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }

        res.status(201).json(user);
      });
    });
  });
};

/**
 * GET /logout
 * Log out.
 */
exports.logout = (req, res) => {
  req.logout();
  req.session.destroy((err) => {
    if (err) console.log('Error : Failed to destroy the session during logout.', err);
    req.user = null;
    res.status(201).send();
  });
};
