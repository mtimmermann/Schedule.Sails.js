/**
 * Schedule Controller
 */

var ScheduleController = {

  index: function(req, res) {
    return res.view('schedule/index', {
      title: 'Schedule',
      //bodyAttr: 'ng-app="UserModule" ng-cloak',
      bodyAttr: '',
      layout: 'layout'
    });
  }
};

module.exports = ScheduleController;