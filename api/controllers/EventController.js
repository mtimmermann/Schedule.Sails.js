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
    findOptions.user = req.user.id;

    Event.find(findOptions)
    .exec(function(err, data) {
      if (err) {
        sails.log.error('Event.list failed. user['+ req.user.id +']', err);
        return res.negotiate(err);
      }

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

    event.user = req.user.id;
    Event.create(event)
    .exec(function(err, data) {
      if (err) {
        sails.log.error('Event.create failed. user['+ req.user.id +']', err);
        return res.negotiate(err);
      }

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

    Event.update({ id: event.id, user: req.user.id }, event)
    .exec(function(err, data) {
      if (err) {
        sails.log.error('Event.update failed. user['+ req.user.id +']', err);
        return res.negotiate(err);
      }
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

    // TODO: Check if auth user matches event user

    Event.destroy({ user: req.user.id, id: id })
    .exec(function(err, result) {
      if (err) {
        sails.log.error('Event.destroy failed. user['+ req.user.id +']', err);
        return res.negotiate(err);
      }
      if (result.length == 0) {
        return res.send(409, 'Event not found');
      }

      return res.json(result);
    });
  }
};

module.exports = EventController;