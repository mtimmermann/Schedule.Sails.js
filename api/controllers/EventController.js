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
   * Create a new user's event
   *
   * POST /api/events
   *
   * @param {Object} req
   * @param {Object} res
   */
  create: function(req, res) {
  }
};

module.exports = EventController;