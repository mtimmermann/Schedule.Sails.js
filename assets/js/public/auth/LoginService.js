app.factory('loginService', ['$http', 'toastr', function($http, toastr) {
  return {

    login: function($scope) {
      $scope.loginForm.loading = true;

      $http.post('/auth/local', {
        identifier: $scope.loginForm.identifier,
        password: $scope.loginForm.password
      })
      .then(function onSuccess (resp) {
        window.location = '/';
      })
      .catch(function onError(resp) {
        if (resp.status === 409 && typeof resp.data === 'string' && resp.data.length > 0) {
          toastr.error(resp.data, 'Error', window.myApp.locals.toastrOptions);
        } else {
          toastr.error('Unknown error', 'Error', window.myApp.locals.toastrOptions);
        }
      })
      .finally(function eitherWay(){
        $scope.loginForm.loading = false;
      });
    }
  };
}]);