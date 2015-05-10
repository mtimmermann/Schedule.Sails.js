angular.module('UserModule').controller('UserDeleteController', ['$scope', '$location', '$routeParams', '$q', 'userService', 'toastr', function($scope, $location, $routeParams, $q, userService, toastr) {

  $scope.user = {};
  $scope.roles = [];
  $scope.selectedRole;
  $scope.isLoading = false;

  var deferredUsers = $q.defer();
  init();

  $scope.delete = function() {
    $scope.isLoading = true;
    userService.deleteUser($scope.user.id)
    .then(function onSuccess(result) {
      $scope.listUsers();
    })
    .catch(function onError(resp) {
      if (resp.status === 409 && typeof resp.data === 'string' && resp.data.length > 0) {
        toastr.error(resp.data, 'Error', window.myApp.locals.toastrOptions);
      } else {
        toastr.error('Error deleting user', 'Error', window.myApp.locals.toastrOptions);
      }
    })
    .finally(function eitherWay() {
      $scope.isLoading = false;
    });
  };

  $scope.listUsers = function() {
     $location.path('/');
  };

  function getUser() {
    userService.getUser($routeParams.id)
    .then(function(result) {
      $scope.user = result.data;
      deferredUsers.resolve($scope.user);
    });
  }

  function getRoles() {
    userService.getRoles()
    .then(function(result) {
      $scope.roles = result.data;
      for (var i=0; i<$scope.roles.length; i++) {
        if ($scope.roles[i].value === $scope.user.role) {
          $scope.selectedRole = $scope.roles[i];
          break;
        }
      }
    });
  }

  function init() {
    getUser();
    deferredUsers.promise.then(function(result) {
      getRoles();
    });
  }
}]);