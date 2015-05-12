angular.module('ProfileModule').controller('ProfilePasswordController', ['$scope', '$rootScope', '$location', '$routeParams', 'profileService', 'toastr', function($scope, $rootScope, $location, $routeParams, userService, toastr) {

  $scope.model = { password: '', confirmation: '' };
  $scope.user = {};
  $scope.isLoading = false;

  init();

  $scope.changePassword = function() {
    $scope.isLoading = true;
    userService.updatePassword($scope.user.id, $scope.model.password, myApp.locals._csrf)
    .then(function onSuccess(result) {
      toastr.success('Password updated', 'Success', myApp.locals.toastrOptions);
    })
    .catch(function onError(resp) {
      if (resp.status === 409 && typeof resp.data === 'string' && resp.data.length > 0) {
        toastr.error(resp.data, 'Error', myApp.locals.toastrOptions);
      } else {
        toastr.error('Error updating password', 'Error', myApp.locals.toastrOptions);
      }
    })
    .finally(function eitherWay() {
      $scope.isLoading = false;
    });
  }

  function getProfile() {
    profileService.getProfile($routeParams.id)
    .then(function(result) {
      $scope.user = result.data;
    });
  }

  function init() {
    getProfile();
  }
}]);