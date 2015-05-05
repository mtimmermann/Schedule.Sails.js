angular.module('ForgotPasswordModule', ['toastr']);

angular.module('ForgotPasswordModule').factory("passwordService", ['$http', function($http) {
  return {
    submitEmail: function(email) {
      return $http.post('/auth/forgotpassword', { email: email });
    }
  };
}]);

angular.module('ForgotPasswordModule').controller('ForgotPasswordController', ['$scope', 'passwordService', 'toastr', function($scope, passwordService, toastr) {

  $scope.model = { email: '' };
  $scope.isLoading = false;

  $scope.submitEmail = function() {
    $scope.isLoading = true;
    passwordService.submitEmail($scope.model.email)
    .then(function onSuccess(result) {
      toastr.success('Email sent. Please check your email.', 'Success', window.myApp.locals.toastrOptions);
    })
    .catch(function onError(resp) {
      if (resp.status === 409 && typeof resp.data === 'string' && resp.data.length > 0) {
        toastr.error(resp.data, 'Error', window.myApp.locals.toastrOptions);
      } else {
        toastr.error('Error submitting forgotton password', 'Error', window.myApp.locals.toastrOptions);
      }
    })
    .finally(function eitherWay() {
      $scope.isLoading = false;
    });
  }
}]);

