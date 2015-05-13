var Q = require('q');
var nodemailer = require('nodemailer');
var transporter = null; // Reusable nodemailer transporter object using SMTP transport

/**
 * Authentication Controller
 *
 * This is merely meant as an example of how your Authentication controller
 * should look. It currently includes the minimum amount of functionality for
 * the basics of Passport.js to work.
 */
var AuthController = {

  /**
   * Render the signup page
   *
   * GET /signup
   *
   * @param {Object} req
   * @param {Object} res
   */
  signup: function (req, res) {
    // If user is logged in, redirect to the dashboard home page
    if (req.session.authenticated) {
      return res.redirect('/');
    }
    res.view('auth/signup', { title: 'Sign Up', bodyAttr: 'ng-app="myApp"', layout: 'layout' });
  },

  /**
   * Render the signup page
   *
   * GET /forgotpassword
   *
   * @param {Object} req
   * @param {Object} res
   */
  forgotpassword: function (req, res) {
    // If user is logged in, redirect to the dashboard home page
    if (req.session.authenticated) {
      return res.redirect('/');
    }
    res.view('auth/forgotpassword', { title: 'Forgot Password', bodyAttr: 'ng-app="myApp"', layout: 'layout' });
  },

  /**
   * Submit an email for a forgotton password
   *
   * POST /auth/forgotpassword
   *
   * @param {Object} req
   * @param {Object} res
   */
  postForgotPassword: function (req, res) {
    var email = typeof req.param('email') === 'string' ? req.param('email') : null;
    if (!email) {
      return res.send(409, 'email is required');
    }

    User.findOne({ email: email })
    .exec(function(err, user) {
      if (err) return res.negotiate(err);
      if (!user) return res.send(409, 'User not found');

      Passport.findOne({ user: user.id, protocol: 'local'})
      .exec(function(err, passport) {
        if (err) return res.negotiate(err);
        if (!passport) return res.send(409, 'User not found');

        PasswordReset.create({ user: user.id, email: email })
        .exec(function(err, data) {
          if (err) return res.negotiate(err);

          var url = req.baseUrl +'/resetpassword?email='+ email +'&id='+ data.id;

          // Create reusable transporter object using SMTP transport
          if (!transporter) transporter = nodemailer.createTransport(sails.config.email.transporterSettings);
          var mailOptions = {
            from: sails.config.email.senderAddress,
            to: email,
            subject: 'Forgotten Password',
            text: url,
            html: '<a href="'+ url +'">Reset Your Password</a>'
          };
          transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
              sails.log.error('Error sending forgotton password submit to: '+ email, error);
              return res.send(409, 'Error sending forgotton password email');
            } else {
              return res.json({});
            }
          });

        });
      });
    });
  },

  /**
   * Display reset password form from email link to user
   *
   * GET /resetpassword
   *
   * @param {Object} req
   * @param {Object} res
   */
  resetPassword: function (req, res) {
    // Log user out if authenticated
    if (req.session.authenticated) {
      req.logout();
      req.session.authenticated = false;
    }

    res.view('auth/resetpassword', { title: 'Reset Password', bodyAttr: 'ng-app="myApp"', layout: 'layout' });
  },

  /**
   * Submit a password reset
   *
   * POST /auth/resetpassword
   *
   * @param {Object} req
   * @param {Object} res
   */
  postResetPassword: function (req, res) {
    var email = typeof req.param('email') === 'string' ? req.param('email') : null;
    var password = typeof req.param('password') === 'string' ? req.param('password') : null;
    var id = typeof req.param('id') === 'string' ? req.param('id') : null;
    if (!email || !password || !id) {
      return res.send(409, 'email, password and id are required');
    }

    Q.all([
      User.findOne({ email: email }),
      PasswordReset.findOne({ id: id })
    ]).spread(function (user, resetUser) {
      if (!user || !resetUser) return res.send(409, 'Email not found');

      if (resetUser.email.toLowerCase() === user.email.toLowerCase() && resetUser.user === user.id) {
        // Update password
        Passport.update({ user: user.id, protocol: 'local' }, { password: password })
        .exec(function(err, data) {
          if (err) {
            sails.log.error('AuthControler.postResetPassword user['+ user.id +' '+ user.email +'] id['+ id +']');
            return res.negotiate(err);
          }

          // On succesful password reset, remove the current PasswordReset record (fire and forget)
          PasswordReset.destroy({ id: id })
          .exec(function(err, data) {
            if (err) sails.log.error('AuthControler.postResetPassword -> Failed to remove PasswordReset record user['+ user.id +' '+ user.email +'] id['+ id +']');
          });

          return res.json({});
        });
      } else {
        // Credentials do not match, fail.
        sails.log.warn('AuthControler.postResetPassword -> Rejected, incorrect credetials: email['+ email +'] id['+ id +']');
        return res.send(409, 'Failed to reset password');
      }
    }).catch(function(err) {
      return res.negotiate(err);
    });
  },

  /**
   * Log out a user and return them to the homepage
   *
   * Passport exposes a logout() function on req (also aliased as logOut()) that
   * can be called from any route handler which needs to terminate a login
   * session. Invoking logout() will remove the req.user property and clear the
   * login session (if any).
   *
   * For more information on logging out users in Passport.js, check out:
   * http://passportjs.org/guide/logout/
   *
   * @param {Object} req
   * @param {Object} res
   */
  logout: function (req, res) {
    req.logout();
    
    // Set user as logged out for auth purposes
    req.session.authenticated = false;

    // Null out session role override if it exists
    req.session.role = null;
    
    res.redirect('/');
  },

  /**
   * Create a authentication callback endpoint
   *
   * This endpoint handles everything related to creating and verifying Pass-
   * ports and users, both locally and from third-aprty providers.
   *
   * Passport exposes a login() function on req (also aliased as logIn()) that
   * can be used to establish a login session. When the login operation
   * completes, user will be assigned to req.user.
   *
   * For more information on logging in users in Passport.js, check out:
   * http://passportjs.org/guide/login/
   *
   * @param {Object} req
   * @param {Object} res
   */
  callback: function (req, res) {

    var action = req.param('action');

    function tryAgain (err) {

      // Only certain error messages are returned via req.flash('error', someError)
      // because we shouldn't expose internal authorization errors to the user.
      // We do return a generic error and the original request body.
      var flashError = req.flash('error')[0];

      if (err && !flashError ) {
        req.flash('error', 'Error.Passport.Generic');
      } else if (flashError) {
        req.flash('error', flashError);
      }
      req.flash('form', req.body);

      // If an error was thrown, redirect the user to the
      // login, register or disconnect action initiator view.
      // These views should take care of rendering the error messages.
      //var action = req.param('action');
      switch (action) {
        case 'register':
          res.redirect('/register');
          break;
        case 'disconnect':
          res.redirect('back');
          break;
        default:
          res.redirect('/login');
      }
    }

    passport.callback(req, res, function (err, user, challenges, statuses) {
      var flashError = req.flash('error')[0];
      if (flashError) {
        if (flashError === 'Error.Passport.Email.Exists') {
          return res.send(409, 'Email address is already taken by another user.');
        } else if (flashError == 'Error.Passport.User.Exists') {
          return res.send(409, 'User Name is already taken by another user.');
        } else if (flashError === 'Error.Passport.Email.NotFound' ||
                   flashError === 'Error.Passport.Password.Wrong' ||
                   flashError === 'Error.Passport.Username.NotFound') {
            return res.send(409, 'Invalid email/password combination.');
        } else {
          return res.send(409, flashError);
        }
      }

      // Ensure login params are present
      if (!action || action === 'login') {
        var identifier = req.param('identifier') ? req.param('identifier'): '';
        var password = req.param('password') ? req.param('password') : '';
        if (identifier.length === 0 || password.length === 0) {
          return res.send(409, 'User Name and Password are required');
        }
      }

      if (err || !user) {
        return tryAgain(challenges);
      }

      req.login(user, function (err) {

        if (err) {
          return tryAgain(err);
        }
        
        // Mark the session as authenticated to work with default Sails sessionAuth.js policy
        req.session.authenticated = true

        req.session.role = user.role;
        
        // Upon successful login, send the user to the homepage were req.user
        // will be available.
        res.redirect('/');
      });
    });
  },

  /**
   * Create a third-party authentication endpoint
   *
   * @param {Object} req
   * @param {Object} res
   */
  provider: function (req, res) {
    passport.endpoint(req, res);
  },

  /**
   * Disconnect a passport from a user
   *
   * @param {Object} req
   * @param {Object} res
   */
  disconnect: function (req, res) {
    passport.disconnect(req, res);
  }

  /**
   * Render the login page
   *
   * The login form itself is just a simple HTML form:
   *
      <form role="form" action="/auth/local" method="post">
        <input type="text" name="identifier" placeholder="Username or Email">
        <input type="password" name="password" placeholder="Password">
        <button type="submit">Sign in</button>
      </form>
   *
   * A simple example of automatically listing all available providers in a
   * Handlebars template would look like this:
   *
      {{#each providers}}
        <a href="/auth/{{slug}}" role="button">{{name}}</a>
      {{/each}}
   *
   * @param {Object} req
   * @param {Object} res
   */
  // login: function (req, res) {
  //   var strategies = sails.config.passport
  //     , providers  = {};

  //   // Get a list of available providers for use in your templates.
  //   Object.keys(strategies).forEach(function (key) {
  //     if (key === 'local') {
  //       return;
  //     }

  //     providers[key] = {
  //       name: strategies[key].name
  //     , slug: key
  //     };
  //   });

  //   // Render the `auth/login.ext` view
  //   res.view({
  //     providers : providers
  //   , errors    : req.flash('error')
  //   });
  // },

  /**
   * Render the registration page
   *
   * Just like the login form, the registration form is just simple HTML:
   *
      <form role="form" action="/auth/local/register" method="post">
        <input type="text" name="username" placeholder="Username">
        <input type="text" name="email" placeholder="Email">
        <input type="password" name="password" placeholder="Password">
        <button type="submit">Sign up</button>
      </form>
   *
   * @param {Object} req
   * @param {Object} res
   */
  // register: function (req, res) {
  //   res.view({
  //     errors: req.flash('error')
  //   });
  // }
};

module.exports = AuthController;
