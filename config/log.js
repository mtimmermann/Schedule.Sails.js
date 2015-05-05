var winston = require('winston');
var MongoDB = require('winston-mongodb').MongoDB;

/**
 * Built-in Log Configuration
 * (sails.config.log)
 *
 * Configure the log level for your app, as well as the transport
 * (Underneath the covers, Sails uses Winston for logging, which
 * allows for some pretty neat custom transports/adapters for log messages)
 *
 * For more information on the Sails logger, check out:
 * http://sailsjs.org/#/documentation/concepts/Logging
 */

var customLogger = new winston.Logger({
  transports: [
    //new(winston.transports.File)({
    //  level: 'info',
    //  filename: './myApp.log',
    //  colorize: false,
    //  maxsize: 1000,
    //  maxFiles: 10
    //}),
    //new(MongoDB)({
    //  level: 'info',
    //  //db: 'mongodb://user:pass@host:port/dbname'
    //  db: 'mongodb://localhost:27017/myapp-sails-logs'
    //}),
    new(winston.transports.Console)({
      level: 'info',
      colorize: true
    })
  ]
});

module.exports.log = {

  /***************************************************************************
  *                                                                          *
  * Valid `level` configs: i.e. the minimum log level to capture with        *
  * sails.log.*()                                                            *
  *                                                                          *
  * The order of precedence for log levels from lowest to highest is:        *
  * silly, verbose, info, debug, warn, error                                 *
  *                                                                          *
  * You may also set the level to "silent" to suppress all logs.             *
  *                                                                          *
  ***************************************************************************/

  //level: 'info',
  //maxSize: 1000

  // http://stackoverflow.com/questions/25211183/sails-js-0-10-x-log-to-file
  // https://github.com/winstonjs/winston/blob/master/docs/transports.md#file-transport
  colors: false,  // To get clean logs without prefixes or color codings
  custom: customLogger

}
