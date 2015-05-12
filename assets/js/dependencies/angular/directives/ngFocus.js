/**
 * ngFocus
 *
 * Angular directive setting focus to an input, since the autofocus attribute
 * only works on a hard page refresh
 *
 * Example usage:
 *   <input type="text" name="title" value="" ng-focus />
 */
angular.module('ngFocus', []);
angular.module('ngFocus').directive('ngFocus', function ($timeout) {

  return {
    //scope: { trigger: '=ngFocus' },

    link: function(scope, el, attr) {

      //scope.$watch('trigger', function(value) {
      //  if (value === 'true') {
      //    $timeout(function() { el[0].focus(); });
      //  }
      //});

      scope.$watch(attr['ngModel'], function(newValue, oldValue) {
        // Trigger focus only after input has been initialized with model
        if ((newValue && !oldValue) || (typeof newValue === 'string' && newValue === '' && typeof oldValue === 'string' && oldValue === '')) {
          //scope.trigger = 'true';
          el[0].focus();
        }
      }, true);
    }
  }
});