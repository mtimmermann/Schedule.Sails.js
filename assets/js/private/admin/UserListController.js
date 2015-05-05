angular.module('UserModule').controller('UserListController', ['$scope', 'userService', 'toastr', function($scope, userService, toastr) {

  $scope.users = [];
  $scope.currentPage = 1;
  $scope.pageSize = 10;
  $scope.filter = '';
  $scope.pagination = { current: 1 };

  // http://ng-admin.marmelab.com/#/posts/list?sortField=posts_ListView.id&sortDir=ASC
  $scope.datagrid = {
    field: 'id',
    sortDir: 'ASC',
    sort: function(field) {
      if (field === this.field) {
        this.sortDir = this.sortDir === 'ASC' ? this.sortDir = 'DESC' : this.sortDir = 'ASC';
      } else {
        this.field = field;
        this.sortDir = 'ASC';
      }
      getResultsPage($scope.currentPage);
    },
    isSorting: function(field) {
      return field === this.field;
    }
  };

  getResultsPage(1);

  $scope.pageChangeHandler = function (num) {
    if (!$scope.pageSize) return null; // Prevent retrieval of full data set
    getResultsPage(num);
  };

  $scope.onFilter = function(filter) {
    getResultsPage($scope.currentPage);
  };

  function getResultsPage(pageNumber) {
    userService.getUsers(pageNumber, $scope.pageSize, $scope.datagrid.field, $scope.datagrid.sortDir, $scope.filter)
    .then(function (result) {
      $scope.users = result.data.Items;
      $scope.totalUsers = result.data.Count;
    });
  };
}]);