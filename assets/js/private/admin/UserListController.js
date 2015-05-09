angular.module('UserModule').controller('UserListController', ['$scope', 'userService', '$modal', 'toastr', function($scope, userService, $modal, toastr) {

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

  $scope.calendarInvite = function(id) {
    console.log('calendarInvite -> '+ id);
    $modal.open({
      templateUrl: 'sendInvite.html',
      backdrop: true,
      windowClass: 'modal',
      //controller: function ($scope, $modalInstance, $log, selectedEvent) {
      controller: function ($scope, $modalInstance, $log) {
        //$scope.selectedEvent = selectedEvent;
        $scope.submit = function() {
          //saveEvent($scope.selectedEvent);
          $modalInstance.dismiss('cancel');
        }
        $scope.delete = function() {
          //deleteEvent($scope.selectedEvent);
          $modalInstance.dismiss('cancel');
        }
        $scope.cancel = function() {
          $modalInstance.dismiss('cancel');
        }
        $modalInstance.rendered.then(function() {
          // Init the jquery simple color picker
          //$('select[name="colorpicker-regularfont"]').simplecolorpicker({theme: 'regularfont'});
        });
      },
      resolve: {
        //selectedEvent: function() {
        //  return $scope.selectedEvent;
        //}
      }
    });
  };

  function getResultsPage(pageNumber) {
    userService.getUsers(pageNumber, $scope.pageSize, $scope.datagrid.field, $scope.datagrid.sortDir, $scope.filter)
    .then(function (result) {
      $scope.users = result.data.Items;
      $scope.totalUsers = result.data.Count;
    });
  };
}]);