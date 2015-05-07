
angular.module('CalendarModule').factory("eventService", ['$http', function($http) {

  var serviceBase = '/api/events/';

  return {
    getEvents: function() {
    },

    createEvent: function(event) {
      return $http.post(serviceBase, { id: userId, password: password });
    }
  };
}]);