angular.module('CalendarModule').factory("eventService", ['$http', function($http) {
  'use strict';

  var serviceBase = '/api/events/';

  return {
    getEvents: function(start, end) {
      var query = start && end ? '?start='+ start +'&end='+ end : '';
      return $http.get(serviceBase + query);
    },

    saveEvent: function(event) {
      // return momentFormat(this, 'YYYY-MM-DD[T]HH:mm:ss'); fullcalendar.js :2674
      //event.start = event.start.format();
      // Always format without timezone
      event.start = event.start.format('YYYY-MM-DD[T]HH:mm:ss');
      //if (event.end) event.end = event.end.format();
      if (event.end) event.end = event.end.format('YYYY-MM-DD[T]HH:mm:ss');
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