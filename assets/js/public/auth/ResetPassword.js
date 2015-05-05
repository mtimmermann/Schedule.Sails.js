var app = angular.module('ResetPasswordModule', ['toastr', 'compareTo']);

angular.module('ResetPasswordModule').factory("resetPasswordService", ['$http', function($http) {
  return {
    changePassword: function(email, password, id) {
      return $http.post('/auth/resetpassword', { email: email, password: password, id: id });
    }
  };
}]);

//angular.module('ResetPasswordModule').controller('ResetPasswordController', ['$scope', '$location', 'resetPasswordService', 'toastr', function($scope, $location, resetPasswordService, toastr) {
angular.module('ResetPasswordModule').controller('ResetPasswordController', ['$scope', 'resetPasswordService', 'loginService', 'toastr', function($scope, resetPasswordService, loginService, toastr) {

  $scope.model = { password: '' };
  $scope.isLoading = false;

  var email = null;
  var id = null;

  init();

  $scope.changePassword = function() {
    $scope.isLoading = true;
    resetPasswordService.changePassword(email, $scope.model.password, id)
    .then(function onSuccess(result) {
      toastr.success('Password successfully reset.', 'Success', window.myApp.locals.toastrOptions);
    })
    .catch(function onError(resp) {
      if (resp.status === 409 && typeof resp.data === 'string' && resp.data.length > 0) {
        toastr.error(resp.data, 'Error', window.myApp.locals.toastrOptions);
      } else {
        toastr.error('Error resetting password.', 'Error', window.myApp.locals.toastrOptions);
      }
    })
    .finally(function eitherWay() {
      $scope.isLoading = false;
    });
  }

  $scope.submitLoginForm = function() {
    loginService.login($scope);
  }

  function init() {
    // TODO: Use $location.search() after angularjs bug fix, currently this will not work without a hash.
    // https://github.com/angular/angular.js/issues/7239
    //email = $location.search().email;
    //id = $location.search().id;
    email = myApp.utils.getParameterByName('email');
    id = myApp.utils.getParameterByName('id');
  }
}]);

