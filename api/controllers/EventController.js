var Q = require('q');
//var Roles = require('../../enums/Roles');

/**
 * Event Controller
 */

var EventController = {

  /**
   * Return a list of user's events if a json request, else
   * Return the schedule calandar view
   *
   * GET /schedule  user's calandar view
   * GET /api/events    json request
   *
   * @param {Object} req
   * @param {Object} res
   */
  list: function(req, res) {

    if (!req.wantsJSON) {
      return res.view('schedule/index', {
        title: 'Schedule',
        bodyAttr: '',
        layout: false
      });
    }

    // Setup filter search params
    var start = req.param('start');
    var end = req.param('end');
    var findOptions = {};
    if (start && end) {
      start = new Date(start);
      end = new Date(end);
      // https://github.com/balderdashy/waterline/issues/110
      findOptions = {
        startTimeStamp: { '>=': start, '<': end }
      };
    }
    findOptions.user = '5539a77d674f4d4c1c4a5e13';

    Event.find(findOptions)
    .exec(function(err, data) {
      if (err) { return res.negotiate(err); }

      return res.json({
        Items: data,
        Count: data.length
      });
    });

  },

  /**
   * Create a new event
   *
   * POST /api/events
   *
   * @param {Object} req
   * @param {Object} res
   */
  create: function(req, res) {
    var event = typeof req.param('event') === 'object' ? req.param('event') : {};
    if (!event.title || !event.start) {
      return res.send(409, 'event.title and event.start are required');
    }

    event.user = '5539a77d674f4d4c1c4a5e13';
    event.startTimeStamp = event.start;
    Event.create(event)
    .exec(function(err, data) {
      if (err) { return res.negotiate(err); }

      return res.json(data);
    });

  },

  /**
   * Update an existing event
   *
   * PUT /api/events
   *
   * @param {Object} req
   * @param {Object} res
   */
  update: function(req, res) {
    var event = typeof req.param('event') === 'object' ? req.param('event') : {};
    if (!event.id || !event.title || !event.start) {
      return res.send(409, 'event.id, event.title and event.start are required');
    }

    // TODO: Check if auth user matches event user

    event.startTimeStamp = event.start;
    Event.update({ id: event.id, user: '5539a77d674f4d4c1c4a5e13' }, event)
    .exec(function(err, data) {
      if (err) { return res.negotiate(err); }
      if (data.length == 0) {
        return res.send(409, 'Event not found');
      }

      return res.json(data[0]);
    });
  },

  /**
   * Delete an existing event
   *
   * DELETE /api/events
   *
   * @param {Object} req
   * @param {Object} res
   */
  destroy: function(req, res) {
    var id = typeof req.param('id') === 'string' ? req.param('id') : null;
    if (!id) {
      return res.send(409, 'id is required');
    }

    Event.destroy({ user: '5539a77d674f4d4c1c4a5e13', id: id })
    .exec(function(err, result) {
      if (err) return res.negotiate(err);
      if (result.length == 0) {
        return res.send(409, 'Event not found');
      }

      return res.json(result);
    });
  },

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
};

module.exports = EventController;