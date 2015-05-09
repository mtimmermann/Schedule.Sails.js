var Q = require('q');
var nodemailer = require('nodemailer');
var transporter = null; // Reusable nodemailer transporter object using SMTP transport

/**
 * ScheduleInvite Controller
 */
var ScheduleInviteController = {

  /**
    * Create a user invite and email with an auth url for the calendar
    *
    * GET /schedule/invite  user's calandar view
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