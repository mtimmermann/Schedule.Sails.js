/**
 * ngSetHiddenInput - Angular directive for accepting ng-model on hidden inputs
 *
 * Example usage:
 *
 *   <input type="hidden" name="someName" value="someValue" ng-model="someProperty" ng-set-hidden-input />
 *
 * This directive works on nested properties, e.g.:
 *  <input type="hidden" name="someName" value="someValue" ng-model="baseModel.propa.propb.someProperty" ng-set-hidden-input />
 * 
 */
angular.module('ngSetHiddenInput', []);
angular.module('ngSetHiddenInput').directive('ngSetHiddenInput', function () {
  return function(scope, el, attr) {
    var model = attr['ngModel'];

    // Update on hidden input change
    scope.$watch(model, function(nv) {
      if (nv) {
        el.val(nv);
      } else {
        init();
      }
    });

    // Initialize the model object(s) and hiden input propery if not set
    function init() {
      var curProp = null;
      var props = model.split('.');
      angular.forEach(props.slice(0, props.length-1), function(prop, index) {

        if (index == 0) {
          scope[prop] = scope[prop] || {};
          curProp = scope[prop];
        } else {
          if (!curProp[prop]) curProp[prop] = {};
          curProp = curProp[prop];
        }
      });

      // Set the hiden input property value
      curProp[props.splice(props.length-1)] = el.val();
    }
  };
});