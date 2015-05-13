var Q = require('q');
var Roles = require('../../enums/Roles');
var nodemailer = require('nodemailer');
var transporter = null; // Reusable nodemailer transporter object using SMTP transport

/**
 * ScheduleInvite Controller
 */
var ScheduleInviteController = {

  /**
   * Return a list of all ScheduleInvite records
   * SiteAdmin Role Only
   *
   * GET /schedule/invite/
   *
   * @param {Object} req
   * @param {Object} res
   */
  list: function(req, res) {
    ScheduleInvite.find()
    .exec(function(err, data) {
      if (err) return res.negotiate(error);

      return res.json(data);
    });
  },

  /**
   * Return an event by User ID and Email
   *
   * GET /schedule/invite/find
   *
   * @param {Object} req
   * @param {Object} res
   */
  find: function(req, res) {
    var userId = typeof req.param('id') === 'string' ? req.param('id') : null;
    var email = typeof req.param('email') === 'string' ? req.param('email') : null;
    if (!userId || !email) {
      return res.send(409, 'id and email are required');
    }

    ScheduleInvite.findOne({ user: userId, email: email })
    .exec(function(err, data) {
      if (err) return res.negotiate(error);

      if (data) {
        data.inviteUrl = req.baseUrl +'/schedule/show?email='+ email +'&id='+ data.id;
      }
      return res.json(data);
    });
  },

  /**
    * Create a user invite and email with an auth url for the calendar
    *
    * POST /schedule/invite  user's calandar view
    *
    * @param {Object} req
    * @param {Object} res
    */
  invite: function(req, res) {
    var email = typeof req.param('email') === 'string' ? req.param('email') : null;
    if (!email) {
      return res.send(409, 'email is required');
    }

    Q.all([
      User.findOne({ email: email }),
      ScheduleInvite.findOne({ email: email })
    ]).spread(function (user, invite) {
      if (!user) return res.send(409, 'Email not found');

      // Defer the sendInvite call
      inviteDeferred = Q.defer();
      inviteDeferred.promise.then(function(result) {
        return res.json(result);
      }).fail(function(error) {
        res.negotiate(error)
      });
      if (!invite) {
        ScheduleInvite.create({ user: user.id, email: email })
        .exec(function(err, data) {
          if (err) {
            sails.log.error('Error creating schedule invite for: '+ email, err);
            inviteDeferred.reject(error)
          }
          var url = req.baseUrl +'/schedule/show?email='+ email +'&id='+ data.id;
          sendInviteEmail(email, url, data);
        });
      } else {
        var url = req.baseUrl +'/schedule/show?email='+ email +'&id='+ invite.id;
        sendInviteEmail(email, url, invite);
      }

    }).catch(function(err) {
      return res.negotiate(err);
    });
  },

  /**
   * Authorize a user invite to view a schedule
   *
   * GET /schedule/show
   *
   * @param {Object} req
   * @param {Object} res
   */
  authInvite: function(req, res) {

    if (req.session.authenticated) {
      req.session.authenticated = false;

      // Null out session role override if it exists
      req.session.role = null;
    }

    var email = typeof req.param('email') === 'string' ? req.param('email') : null;
    var inviteId = typeof req.param('id') === 'string' ? req.param('id') : null;
    if (!email || !inviteId) return res.forbidden('You are not permitted to perform this action.');

    Q.all([
      User.findOne({ email: email }),
      ScheduleInvite.findOne({ email: email, id: inviteId })
    ]).spread(function (user, invite) {
      if (!user) return res.send(409, 'Email not found');
      if (!invite) return res.send(409, 'Email invite not found');

      // Authenticate user
      req.login(user, function (err) {
        if (err) return res.negotiate(err);

        req.session.authenticated = true;

        // Override the session role with most limited priveleges, only allow calendar access
        req.session.role = Roles.guest;

        return res.redirect('/schedule');
      });

    }).catch(function(err) {
      return res.negotiate(err);
    });
  }
};


var inviteDeferred = null;

function sendInviteEmail (email, url, inviteData) {
  // Create reusable transporter object using SMTP transport
  if (!transporter) transporter = nodemailer.createTransport(sails.config.email.transporterSettings);
  var mailOptions = {
    from: sails.config.email.senderAddress,
    to: email,
    subject: 'Schedule Invite',
    text: url,
    html: '<a href="'+ url +'">View your schedule</a>'
  };
  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      sails.log.error('Error sending schedule invite email to: '+ email, error);
      inviteDeferred.reject(error);
    } else {
      inviteDeferred.resolve(inviteData);
    }
  });
}

module.exports = ScheduleInviteController;