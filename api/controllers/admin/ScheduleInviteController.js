var Q = require('q');

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

      if (!invite) {
        ScheduleInvite.create({ user: user.id, email: email })
        .exec(function(err, data) {
          if (err) return res.negotiate(err);
          return res.json(data);
        });
      } else {
        return res.json(invite);
      }
    }).catch(function(err) {
      return res.negotiate(err);
    });
  }
};

module.exports = ScheduleInviteController;