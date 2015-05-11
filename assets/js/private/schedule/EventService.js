angular.module('CalendarModule').factory("eventService", ['$http', function($http) {
  'use strict';

  var serviceBase = '/api/events/';

  var utcOffsetHours = new Date().getTimezoneOffset() / 60;

  return {
    getEvents: function(start, end) {
      var query = start && end ? '?start='+ start +'&end='+ end : '';
      return $http.get(serviceBase + query);
    },

    saveEvent: function(event) {
      // Always format without timezone
      event.start = event.start.format('YYYY-MM-DD[T]HH:mm:ss');
      if (event.end) event.end = event.end.format('YYYY-MM-DD[T]HH:mm:ss');

      // Create an event ISO timestamp and local date string for timezone
      // records since event.start & event.end are stored and used in the
      // calendar as local times.
      var startTimeStamp = new Date(event.start);
      startTimeStamp.setHours(startTimeStamp.getHours() + utcOffsetHours);
      event.startTimeStamp = startTimeStamp.toISOString();
      event.startTimeLocal = startTimeStamp.toString();

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