angular.module('CalendarModule').controller('CalendarController', ['$scope', 'eventService', '$compile', 'uiCalendarConfig', '$modal', 'toastr', function($scope, eventService, $compile, uiCalendarConfig, $modal, toastr) {
  'use strict';

  var myCalendar1 = null; // Global calendar, using only one calendar

  // The calendar event source wire-up
  // http://fullcalendar.io/docs/event_data/events_function/
  $scope.events = function(start, end, timezone, callback) {
    //console.log('getEvents: start['+ start.toISOString() +'] end['+ end.toISOString() +']');

    eventService.getEvents(start.toISOString(), end.toISOString())
    .then(function (result) {
      var events = [];
      angular.forEach(result.data.Items, function(value, key) {
        var event = {
          id: value.id,
          title: value.title,
          start: moment(value.start),
          end: value.end ? moment(value.end) : null,
          color: value.color || null
        };
        events.push(event);
      });
      callback(events);
    })
    .catch(function onError(resp) {
      if (resp.status === 409 && typeof resp.data === 'string' && resp.data.length > 0) {
        toastr.error(resp.data, 'Error', myApp.locals.toastrOptions);
      } else {
        toastr.error('Error retrieving events', 'Error', myApp.locals.toastrOptions);
      }
    })
    .finally(function eitherWay() {
      //$scope.renderCalender('myCalendar1');
    });
  };

  $scope.eventSources = [$scope.events];

  // Create an event
  var holdTempEvent = null; // A holder to remove a temporary event on edit cancel
  $scope.select = function(start, end) {
    //console.log('select (create event): start['+ start.toISOString() +'] start._ambigZone['+ start._ambigZone +'] start.isUTC()['+ start.isUTC() +'] end['+ end.toISOString() +']');

    // If in month view, set the times
    if (start.hour() === 0 && end.hour() === 0 && start._ambigTime && end._ambigTime) {
      start._ambigTime = false;
      end._ambigTime = false;
      start.hour(10); // Default to 10:00 am
      end.hour(start.hour() + 1);
      end.day(start.day());
    }

    var event = {
      title: '',
      start: start, //angular.copy(start),
      end: end, //angular.copy(end),
      color: '#5484ed', // Default Bold Blue
      allDay: false
    };

    // Making the new event sticky - won't dissapear on lost focus when edit modal opens
    // Temporarily add event to maintain rendered state while edit modal opens.
    // Set the holdTempEvent, remove it from calendar if edit modal action is a cancel.
    myCalendar1.fullCalendar('renderEvent', event);
    var eventList = myCalendar1.fullCalendar('clientEvents');
    holdTempEvent = eventList[eventList.length-1];

    openEditModal(event);
  };

  // Edit event on eventClick
  $scope.alertOnEventClick = function(date, jsEvent, view) {
    //console.log('alertOnEventClick (Edit existing event): start['+ date.start.toISOString() +'] start._ambigZone['+ date.start._ambigZone +'] start.isUTC()['+ date.start.isUTC() +'] end['+ date.end.toISOString() +']');
    openEditModal(date);
  };

  // On event drop to another date spot
  $scope.alertOnDrop = function(event, delta, revertFunc, jsEvent, ui, view){
    //console.log('Event Droped to make dayDelta ' + delta);
    saveEvent(event);
  };

  // On event time resize
  $scope.alertOnResize = function(event, delta, revertFunc, jsEvent, ui, view ){
    //console.log('alertOnResize');
    saveEvent(event);
  };

  // Render Tooltip
  $scope.eventRender = function(event, element, view) { 
    var tooltip = event.title +'\n'+
      event.start.format('h:mm:ss a') +'\n to\n'+
      event.end.format('h:mm:ss a');
    element.attr({'tooltip': tooltip, 'tooltip-append-to-body': true});
    $compile(element)($scope);
  };

  $scope.renderCalender = function(calendar) {
    //console.log('renderCalender');
    if (uiCalendarConfig.calendars[calendar]) {
      uiCalendarConfig.calendars[calendar].fullCalendar('render');
    }
  };

  // Change View
  $scope.changeView = function(view, calendar) {
    //console.log('changeView: '+ view +' '+ calendar);
    uiCalendarConfig.calendars[calendar].fullCalendar('changeView', view);
  };

  // On viewRender, anytime the calendar is rendered
  $scope.viewRender = function(view, element) {
    //console.log('viewRender');

    // Set/init the global myCalendar1 object
    if (!myCalendar1) myCalendar1 = uiCalendarConfig.calendars['myCalendar1'];

    // Limit the available calendar days
    //var minStart = moment().add(-2, 'days');
    //if (view.start < minStart) {
    //  $('#directives-calendar .fc-prev-button').prop('disabled', true);
    //  $('#directives-calendar .fc-prev-button').addClass('fc-state-disabled');
    //} else {
    //  $('#directives-calendar .fc-prev-button').prop('disabled', false);
    //  $('#directives-calendar .fc-prev-button').removeClass('fc-state-disabled');
    //}
    //var maxEnd = moment().add(14, 'days');
    //if (view.end > maxEnd) {
    //  $('#directives-calendar .fc-next-button').prop('disabled', true);
    //  $('#directives-calendar .fc-next-button').addClass('fc-state-disabled');
    //} else {
    //  $('#directives-calendar .fc-next-button').prop('disabled', false);
    //  $('#directives-calendar .fc-next-button').removeClass('fc-state-disabled');
    //}
  };

  $scope.uiConfig = {
    calendar:{
      defaultView: 'agendaWeek',
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
      eventRender: $scope.eventRender,
      viewRender: $scope.viewRender
    }
  };

  // Create event or update existing event
  function saveEvent(event) {
    var isNew = event.id ? false : true;
    eventService.saveEvent(event, myApp.locals._csrf)
    .then(function onSuccess(result) {
      toastr.success('Event saved', 'Success', myApp.locals.toastrOptions);
      if (isNew) {
        event.id = result.data.id;
        //$scope.events.push(event);
        //myCalendar1.fullCalendar('renderEvent', event, true);
        myCalendar1.fullCalendar('renderEvent', event);
      } else {
        myCalendar1.fullCalendar('updateEvent', event);
      }
    })
    .catch(function onError(resp) {
      if (resp.status === 409 && typeof resp.data === 'string' && resp.data.length > 0) {
        toastr.error(resp.data, 'Error', myApp.locals.toastrOptions);
      } else {
        toastr.error('Error saving event', 'Error', myApp.locals.toastrOptions);
      }
    })
    .finally(function eitherWay() {
      $('#calendar').fullCalendar('unselect');
    });
  }

  // Delete an existing event
  function deleteEvent(event) {
    eventService.deleteEvent(event.id, myApp.locals._csrf)
    .then(function onSuccess(result) {
      toastr.success('Event removed', 'Success', myApp.locals.toastrOptions);
      myCalendar1.fullCalendar('removeEvents', [ event._id ] );
    })
    .catch(function onError(resp) {
      if (resp.status === 409 && typeof resp.data === 'string' && resp.data.length > 0) {
        toastr.error(resp.data, 'Error', myApp.locals.toastrOptions);
      } else {
        toastr.error('Error removing event', 'Error', myApp.locals.toastrOptions);
      }
    })
    .finally(function eitherWay() {
      $('#calendar').fullCalendar('unselect');
    });
  }

  function openEditModal(event) {
    $scope.selectedEvent = angular.copy(event);
    var selectedEvent = $scope.selectedEvent

    // Angular JS Bootstrap modal
    // https://angular-ui.github.io/bootstrap/
    // http://plnkr.co/edit/bfpma2?p=preview
    $modal.open({
      templateUrl: 'editEventModal.html',
      backdrop: true,
      windowClass: 'modal',
      controller: function ($scope, $modalInstance, $log, selectedEvent) {
        $scope.selectedEvent = selectedEvent;

        var start, end = null;
        if ($scope.selectedEvent.start.isUTC()) {
          start = new Date(selectedEvent.start.year(), selectedEvent.start.month(), selectedEvent.start.date(), selectedEvent.start.hour(), selectedEvent.start.minute(), 0, 0);
          end = new Date(selectedEvent.end.year(), selectedEvent.end.month(), selectedEvent.end.date(), selectedEvent.end.hour(), selectedEvent.end.minute(), 0, 0);
        } else {
          start = new Date($scope.selectedEvent.start.format());
          end = new Date($scope.selectedEvent.end.format());
        }

        // Date picker model
        $scope.data = {
          start: start,
          end: end,
          isEndValid: true
        };
        // Date picker onSetTime callback
        $scope.onSetTime = function(newDate, oldDate) {
          $scope.data.isEndValid = $scope.data.start < $scope.data.end;
        };

        $scope.submit = function() {
          setMomentDate($scope.data.start, $scope.selectedEvent.start);
          setMomentDate($scope.data.end, $scope.selectedEvent.end);
          //$scope.data.start._ambigTime = false; $scope.data.start._ambigZone = true;
          //$scope.data.end._ambigTime = false; $scope.data.end._ambigZone = true;
          saveEvent($scope.selectedEvent);
          $modalInstance.dismiss('cancel');
        };
        $scope.delete = function() {
          deleteEvent($scope.selectedEvent);
          $modalInstance.dismiss('cancel');
        };
        $scope.cancel = function() {
          $modalInstance.dismiss('cancel');
        };
        $modalInstance.rendered.then(function() {
          // Init the jquery simple color picker
          $('select[name="colorpicker-regularfont"]').simplecolorpicker({theme: 'regularfont'});
          $('#createEventForm input[name="title"]').focus();
        });
        // http://stackoverflow.com/questions/18962536/angular-ui-modal-after-close-event
        $modalInstance.result.then(function() {
          //console.log('modal success'); // never called
        }, function() {
          // Remove, unstick temporary event on every edit event modal close
          if (holdTempEvent) {
            myCalendar1.fullCalendar('removeEvents', [ holdTempEvent._id ] );
            holdTempEvent = null;
          }
        });
        function setMomentDate(date, mDate) {
          mDate.year(date.getFullYear());
          mDate.month(date.getMonth());
          mDate.date(date.getDate());
          mDate.minute(date.getMinutes());
          mDate.hour(date.getHours());
        }
      },
      resolve: {
        selectedEvent: function() {
          return $scope.selectedEvent;
        }
      }
    });
  }

}]);