// Login Service
app.factory('loginService', ['$http', function($http) {

  return {
 
    login: function(model) {
      return $http.post('/auth/local', {
        identifier: model.identifier,
        password: model.password,
        _csrf: model._csrf
      });
    }
  };
}]);

// Login Controller
app.controller('LoginController', ['$scope', 'loginService', 'toastr', function($scope, loginService, toastr) {

  var toastrOptions = angular.extend({
    timeOut: 3000,
    closeButton: true
  }, myApp.locals.toastrOptions);

  $scope.loginForm = { loading: false };

  $scope.submitLoginForm = function () {
    $scope.loginForm.loading = true;

    loginService.login($scope.loginForm)
    .then(function onSuccess (resp) {
      window.location = '/';
    })
    .catch(function onError(resp) {
      if (resp.status === 409 && typeof resp.data === 'string' && resp.data.length > 0) {
        toastr.error(resp.data, 'Error', toastrOptions);
      } else {
        toastr.error('Unknown error', 'Error', toastrOptions);
      }
      $scope.loginForm.loginFailed = true;
    })
    .finally(function eitherWay(){
      $scope.loginForm.loading = false;
    });
  };

}]);