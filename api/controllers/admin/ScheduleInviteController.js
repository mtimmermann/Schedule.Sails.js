var Q = require('q');
var Roles = require('../../enums/Roles');

/**
 * ScheduleInvite Controller
 */

var ScheduleInviteController = {

  /**
   * Authorize a user invite to view a schedule
   *
   * GET /showschedule
   *
   * @param {Object} req
   * @param {Object} res
   */
  authInvite: function(req, res) {
    if (!req.session.authenticated) {
      var email = typeof req.param('email') === 'string' ? req.param('email') : null;
      var inviteId = typeof req.param('id') === 'string' ? req.param('id') : null;
      if (!email || !inviteId) return res.forbidden('You are not permitted to perform this action.');

      Q.all([
        User.findOne({ email: email }),
        ScheduleInvite.findOne({ email: email, id: inviteId })
      ]).spread(function (user, invite) {
        if (!user) return res.send(409, 'Email not found');
        if (!invite) return res.send(409, 'Email invite not found');

        //user.role = Roles.user;
        req.session.authenticated = true;
        //req.passport.user = user;
        //req.user = user;

        //return res.json({});
        return res.redirect('/schedule');

      }).catch(function(err) {
        return res.negotiate(err);
      });
    } else {
      return res.redirect('/schedule');
    }
  },

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