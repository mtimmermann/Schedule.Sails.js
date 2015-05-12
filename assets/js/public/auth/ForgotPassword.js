var app = angular.module('ForgotPasswordModule', ['toastr', 'ngSetHiddenInput']);

angular.module('ForgotPasswordModule').factory("passwordService", ['$http', function($http) {
  return {
    submitEmail: function(email, csrf) {
      return $http.post('/auth/forgotpassword', { email: email, _csrf: csrf });
    }
  };
}]);

angular.module('ForgotPasswordModule').controller('ForgotPasswordController', ['$scope', 'passwordService', 'loginService', 'toastr', function($scope, passwordService, loginService, toastr) {

  $scope.model = { email: '' };
  $scope.isLoading = false;

  $scope.submitEmail = function() {
    $scope.isLoading = true;
    passwordService.submitEmail($scope.model.email, $scope.model._csrf)
    .then(function onSuccess(result) {
      toastr.success('Email sent. Please check your email.', 'Success', myApp.locals.toastrOptions);
    })
    .catch(function onError(resp) {
      if (resp.status === 409 && typeof resp.data === 'string' && resp.data.length > 0) {
        toastr.error(resp.data, 'Error', myApp.locals.toastrOptions);
      } else {
        toastr.error('Error submitting forgotton password', 'Error', myApp.locals.toastrOptions);
      }
    })
    .finally(function eitherWay() {
      $scope.isLoading = false;
    });
  };

  $scope.submitLoginForm = function () {
      loginService.login($scope);
  };
}]);

