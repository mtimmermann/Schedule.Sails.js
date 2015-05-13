// Signup Service
app.factory('signupService', ['$http', function($http) {
  return {
    signup: function(username, email, password, csrf) {
      return $http.post('/auth/local/register', { username: username, email: email, password: password, _csrf: csrf });
    }
  }
}]);

// Signup Controller
app.controller('SignupController', ['$scope', '$http', 'signupService', 'toastr', function($scope, $http, signupService, toastr) {

    // Setup pending state
    $scope.model = { pending: false }

    $scope.submitSignupForm = function() {

      $scope.model.pending = true;

      signupService.signup($scope.model.username, $scope.model.email, $scope.model.password, $scope.model._csrf)
      .then(function onSuccess(resp) {
        window.location = '/';
      })
      .catch(function onError(resp) {
        if (resp.status === 409 && typeof resp.data === 'string' && resp.data.length > 0) {
          toastr.error(resp.data, 'Error', myApp.locals.toastrOptions);
        } else {
          toastr.error('Unknown error', 'Error', myApp.locals.toastrOptions);
        }
      })
      .finally(function eitherWay() {
        $scope.model.pending = false;
      });
    };

    $scope.dirtyAndErrors = function(input) {
      return (input.$dirty && Object.keys(input.$error).length > 0);
    };
}]);
