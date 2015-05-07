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

    // 5539a77d674f4d4c1c4a5e13
    Event.create({ user: '5539a77d674f4d4c1c4a5e13', title: event.title, start: event.start })
    .exec(function(err, data) {
      if (err) { return res.negotiate(err); }

      return res.json({});
    });

  }
};

module.exports = EventController;