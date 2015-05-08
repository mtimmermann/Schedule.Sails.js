
angular.module('CalendarModule').factory("eventService", ['$http', function($http) {

  var serviceBase = '/api/events/';

  return {
    getEvents: function(start, end) {
      var query = start && end ? '?start='+ start +'&end='+ end : '';
      return $http.get(serviceBase + query);
    },

    saveEvent: function(event) {
      event.start = event.start.format();
      if (event.end) event.end = event.end.format();
      if (event.id) {
        return $http.put(serviceBase, { event: event });
      } else {
        return $http.post(serviceBase, { event: event });
      }
    },

    deleteEvent: function(id) {
      return $http.delete(serviceBase + id);
    }
  };
}]);