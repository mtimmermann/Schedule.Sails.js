angular.module('ProfileModule').controller('ProfileEditController', ['$scope', '$location', '$routeParams', 'profileService', 'toastr', function($scope, $location, $routeParams, profileService, toastr) {
  
  $scope.user = {};
  $scope.roles = [];
  $scope.selectedRole;
  $scope.isLoading = false;

  init();

  $scope.saveProfile = function() {
    $scope.isLoading = true;
    profileService.updateProfile($scope.user, myApp.locals._csrf)
    .then(function onSuccess(result) {
      toastr.success('User saved', 'Success', myApp.locals.toastrOptions);
    })
    .catch(function onError(resp) {
      if (resp.status === 409 && typeof resp.data === 'string' && resp.data.length > 0) {
        toastr.error(resp.data, 'Error', myApp.locals.toastrOptions);
      } else {
        toastr.error('Error saving user', 'Error', myApp.locals.toastrOptions);
      }
    })
    .finally(function eitherWay() {
      $scope.isLoading = false;
    });
  };

  function getProfile() {
    profileService.getProfile()
    .then(function(result) {
      $scope.user = result.data;
    });
  }

  function init() {
    getProfile();
  }
}]);