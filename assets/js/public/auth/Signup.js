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

    // Setup loading state
    $scope.signupForm = { loading: false }

    $scope.submitSignupForm = function() {

        $scope.signupForm.loading = true;

        signupService.signup($scope.signupForm.username, $scope.signupForm.email, $scope.signupForm.password, $scope.signupForm._csrf)
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
            $scope.signupForm.loading = false;
        });
    };

}]);
