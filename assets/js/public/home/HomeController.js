angular.module('HomeModule').controller('HomeController', ['$scope', '$http', 'loginService', 'toastr', function($scope, $http, loginService, toastr) {

  $scope.submitLoginForm = function() {
    loginService.login($scope);
  }

}]);
