angular.module('CalendarModule').controller('CalendarController', ['$scope', 'eventService', '$compile', 'uiCalendarConfig', '$modal', 'toastr', function($scope, eventService, $compile, uiCalendarConfig, $modal, toastr) {
    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();

    $scope.selectedEvent = null;

    $scope.events = [];
    /* event source that contains custom events on the scope */
    //$scope.events = [
    //  //{title: 'All Day Event',start: new Date(y, m, 1)},
    //  {title: 'All Day Event',start: new Date(y, m, 1), color: '#f00'},
    //  {title: 'Long Event',start: new Date(y, m, d - 5),end: new Date(y, m, d - 2)},
    //  {id: 999,title: 'Repeating Event',start: new Date(y, m, d - 3, 16, 0),allDay: false},
    //  {id: 999,title: 'Repeating Event',start: new Date(y, m, d + 4, 16, 0),allDay: false},
    //  {title: 'Birthday Party',start: new Date(y, m, d + 1, 19, 0),end: new Date(y, m, d + 1, 22, 30),allDay: false},
    //  //{title: 'Test Red',start: new Date(y, m, d + 2, 19, 0),end: new Date(y, m, d + 2, 22, 30),allDay: false, color: '#f00'},
    //  {title: 'Click for Google',start: new Date(y, m, 28),end: new Date(y, m, 29),url: 'http://google.com/'}
    //];
    /* event source that calls a function on every view switch */
    //$scope.eventsF = function (start, end, timezone, callback) {
    //  var s = new Date(start).getTime() / 1000;
    //  var e = new Date(end).getTime() / 1000;
    //  var m = new Date(start).getMonth();
    //  var events = [{title: 'Feed Me ' + m,start: s + (50000),end: s + (100000),allDay: false, className: ['customFeed']}];
    //  callback(events);
    //};

    //$scope.calEventsExt = {
    //   color: '#f00',
    //   textColor: 'yellow',
    //   events: [ 
    //      {type:'party',title: 'Lunch',start: new Date(y, m, d, 12, 0),end: new Date(y, m, d, 14, 0),allDay: false},
    //      {type:'party',title: 'Lunch 2',start: new Date(y, m, d, 12, 0),end: new Date(y, m, d, 14, 0),allDay: false},
    //      {type:'party',title: 'Click for Google',start: new Date(y, m, 28),end: new Date(y, m, 29),url: 'http://google.com/'}
    //    ]
    //};

    // Edit event on eventClick
    $scope.alertOnEventClick = function(date, jsEvent, view) {
        $scope.selectedEvent = angular.copy(date);
        var selectedEvent = $scope.selectedEvent
        // http://plnkr.co/edit/bfpma2?p=preview
        $modal.open({
          templateUrl: 'editEventModal.html',
          backdrop: true,
          windowClass: 'modal',
          controller: function ($scope, $modalInstance, $log, selectedEvent) {
            $scope.selectedEvent = selectedEvent;
            $scope.submit = function() {
              saveEvent($scope.selectedEvent);
              $modalInstance.dismiss('cancel');
            }
            $scope.cancel = function() {
              $modalInstance.dismiss('cancel');
            };
            $scope.delete = function() {
              deleteEvent($scope.selectedEvent);
              $modalInstance.dismiss('cancel');
            };
          },
          resolve: {
            selectedEvent: function() {
              return $scope.selectedEvent;
            }
          }
        });
    };

    /* alert on Drop */
     $scope.alertOnDrop = function(event, delta, revertFunc, jsEvent, ui, view){
       $scope.alertMessage = ('Event Droped to make dayDelta ' + delta);
       console.log('Event Droped to make dayDelta ' + delta);
    };
    /* alert on Resize */
    $scope.alertOnResize = function(event, delta, revertFunc, jsEvent, ui, view ){
       $scope.alertMessage = ('Event Resized to make dayDelta ' + delta);
    };
    /* add and removes an event source of choice */
    $scope.addRemoveEventSource = function(sources,source) {
      console.log('addRemoveEventSource');
      var canAdd = 0;
      angular.forEach(sources,function(value, key){
        if(sources[key] === source){
          sources.splice(key,1);
          canAdd = 1;
        }
      });
      if(canAdd === 0){
        sources.push(source);
      }
    };

    /* remove event */
    $scope.remove = function(index) {
      console.log('remove');
      $scope.events.splice(index,1);
    };
    /* Change View */
    $scope.changeView = function(view,calendar) {
      console.log('chaneView');
      uiCalendarConfig.calendars[calendar].fullCalendar('changeView',view);
    };
    /* Change View */
    $scope.renderCalender = function(calendar) {
      if(uiCalendarConfig.calendars[calendar]){
        uiCalendarConfig.calendars[calendar].fullCalendar('render');
      }
    };

    // Render Tooltip
    $scope.eventRender = function( event, element, view ) { 
        element.attr({'tooltip': event.title,
                      'tooltip-append-to-body': true});
        $compile(element)($scope);
    };

    // Create an event
    $scope.select = function(start, end) {
      console.log('select: start['+ start +'] end['+ end +']');

      var event = {
        title: '',
        start: start,
        end: end
      };

      $scope.selectedEvent = angular.copy(event);
      var selectedEvent = $scope.selectedEvent

      $modal.open({
        templateUrl: 'editEventModal.html',
        backdrop: true,
        windowClass: 'modal',
        controller: function ($scope, $modalInstance, $log, selectedEvent) {
          $scope.selectedEvent = selectedEvent;
          $scope.submit = function() {
            $log.log('Updating event.');
            //$scope.events.push($scope.selectedEvent);
            //uiCalendarConfig.calendars['myCalendar1'].fullCalendar('updateEvent', $scope.selectedEvent);
            saveEvent($scope.selectedEvent);
            $modalInstance.dismiss('cancel');
          }
          $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
          };
        },
        resolve: {
          selectedEvent: function() {
            return $scope.selectedEvent;
          }
        }
      });
    };

    $scope.uiConfig = {
      calendar:{
        height: 450,
        editable: true,
        header:{
          left: 'title',
          center: '',
          right: 'today prev,next'
        },
      selectable: true,
      selectHelper: true,
      select: $scope.select,
        eventClick: $scope.alertOnEventClick,
        eventDrop: $scope.alertOnDrop,
        eventResize: $scope.alertOnResize,
        eventRender: $scope.eventRender
      }
    };

    //$scope.eventSources = [$scope.events, $scope.eventsF];
    $scope.eventSources = [$scope.events];

    function init() {
      getEvents();
    }

    function getEvents() {
      eventService.getEvents()
      .then(function (result) {
        angular.forEach(result.data.Items, function(value, key) {
          var event = {
            id: value.id,
            title: value.title,
            start: moment(value.start)
            //start: moment.utc(value.start).local()
            //start: new Date(moment.utc(value.start).format())
          };
          if (value.end) {
            event.end = new moment(value.end);
            //event.end = moment.utc(value.end).local()
            //event.end = new Date(moment.utc(value.end).format());
          }
          $scope.events.push(event);
        });
      })
      .finally(function eitherWay() {
        $scope.renderCalender('myCalendar1');
      });
    }

    // Create event or update existing event
    function saveEvent(event) {
      var isNew = event.id ? false : true;
      eventService.saveEvent(event)
      .then(function onSuccess(result) {
        toastr.success('Event saved', 'Success', window.myApp.locals.toastrOptions);
        if (isNew) {
          event.id = result.data.id;
          $scope.events.push(event);
        } else {
          uiCalendarConfig.calendars['myCalendar1'].fullCalendar('updateEvent', event);
        }
      })
      .catch(function onError(resp) {
        if (resp.status === 409 && typeof resp.data === 'string' && resp.data.length > 0) {
          toastr.error(resp.data, 'Error', window.myApp.locals.toastrOptions);
        } else {
          toastr.error('Error saving event', 'Error', window.myApp.locals.toastrOptions);
        }
      })
      .finally(function eitherWay() {
        $('#calendar').fullCalendar('unselect');
      });
    }

    // Delete an existing event
    function deleteEvent(event) {
      eventService.deleteEvent(event.id)
      .then(function onSuccess(result) {
        toastr.success('Event removed', 'Success', window.myApp.locals.toastrOptions);
        uiCalendarConfig.calendars['myCalendar1'].fullCalendar('removeEvents', [ event._id ] );
      })
      .catch(function onError(resp) {
        if (resp.status === 409 && typeof resp.data === 'string' && resp.data.length > 0) {
          toastr.error(resp.data, 'Error', window.myApp.locals.toastrOptions);
        } else {
          toastr.error('Error removing event', 'Error', window.myApp.locals.toastrOptions);
        }
      })
      .finally(function eitherWay() {
        $('#calendar').fullCalendar('unselect');
      });
    }

    init();

}]);