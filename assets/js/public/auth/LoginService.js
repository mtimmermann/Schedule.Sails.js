app.factory('loginService', ['$http', 'toastr', function($http, toastr) {

  var toastrOptions = angular.extend({
    timeOut: 3000,
    closeButton: true
  }, myApp.locals.toastrOptions);

  return {
 
    login: function($scope) {
      $scope.loginForm.loading = true;

      $http.post('/auth/local', {
        identifier: $scope.loginForm.identifier,
        password: $scope.loginForm.password,
        _csrf: $scope.loginForm._csrf
      })
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
    }
  };
}]);