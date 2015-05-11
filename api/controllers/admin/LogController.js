//var mongodb = require('mongodb');

var fromHours = -24 * 7; // Default to a week back (Winston query will default to 24 hours)

/**
 * Log Controller
 */
var LogController = {

  /**
   * View and query the database logs
   *
   * GET /adminpanel/logs
   *
   * @param {Object} req
   * @param {Object} res
   */
  list: function(req, res) {

    // https://github.com/winstonjs/winston#querying-logs
    var options = {
      start: req.param('start') || 0,
      limit: req.param('limit') || 100,
      order: req.param('order') || 'desc',
      //fields: ['message', 'level'],
      //type: 'console'
      //type: 'mongodb'
    };
    
    var fields = typeof req.param('fields') == 'string' ? req.param('fields') : null;
    if (fields) options.fields = fields.split(',');

    var from = req.param('from') ? new Date(req.param('from')) : new Date().setHours(fromHours);
    if (from) options.from = from;

    var until = req.param('until') ? new Date(req.param('until')) : null;
    if (until) options.until = until;


    //sails.config.log.custom.transports.mongodb.query(options, function (err, result) {
    sails.config.log.custom.query(options, function (err, result) {
      if (err) return res.negotiate(err);

      result.count = result.mongodb && result.mongodb.length ? result.mongodb.length : 0;
      return res.json(result);
    });
  }
};

module.exports = LogController;