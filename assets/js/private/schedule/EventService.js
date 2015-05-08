
angular.module('CalendarModule').factory("eventService", ['$http', function($http) {

  var serviceBase = '/api/events/';

  return {
    getEvents: function() {
      return $http.get(serviceBase);
    },

    createEvent: function(event) {
      event.start = event.start.format();
      if (event.end) event.end = event.end.format();
      return $http.post(serviceBase, { event: event });
    }
  };
}]);