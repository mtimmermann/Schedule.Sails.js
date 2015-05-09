//var mongodb = require('mongodb');

/**
 * Log Controller
 */
var LogController = {
  list: function(req, res) {

    //mongodb.MongoClient.connect(this.db, this.options, function(err, db) {
    //  if (err) {
    //    console.error('winston-mongodb: error initialising logger', err);
    //    return;
    //  }
    //  setupDatabaseAndEmptyQueue(db);
    //});

    http://stackoverflow.com/questions/17755173/querying-winston-logs
    /*var options = {
        from:   new Date - 24 * 60 * 60 * 1000,
        until:  new Date,
        limit:  10,
        start:  0,
        order:  'asc',
        fields: ['message']
    };
    logger.query(options, function (err, result) {
        if (err) {
            throw err;
        }

        console.log(result);
    });*/

    var options = {
      start: 0,
      limit: 100,
      order: 'desc',
      fields: ['message', 'level']
    };

    sails.config.log.custom.transports.mongodb.query(options, function (err, result) {
      if (err) return res.negotiate(err);
      return res.json(result);
    });

    //return res.json({});
  }
};

module.exports = LogController;