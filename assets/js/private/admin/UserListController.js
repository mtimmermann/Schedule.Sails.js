angular.module('UserModule').controller('UserListController', ['$scope', 'userService', '$modal', 'toastr', function($scope, userService, $modal, toastr) {

  $scope.users = [];
  $scope.currentPage = 1;
  $scope.pageSize = 10;
  $scope.filter = '';
  $scope.pagination = { current: 1 };
  $scope.isFullView = window.myApp.locals.isFullView;

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

  function sendCalendarInvite(email) {
    console.log('sendCalendarInvite -> '+ email);
    userService.sendCalenderInvite(email)
    .then(function (result) {
      toastr.success('Calendar invite sent', 'Success', window.myApp.locals.toastrOptions);
    })
    .catch(function onError(resp) {
      if (resp.status === 409 && typeof resp.data === 'string' && resp.data.length > 0) {
        toastr.error(resp.data, 'Error', window.myApp.locals.toastrOptions);
      } else {
        toastr.error('Error sending calendar invite', 'Error', window.myApp.locals.toastrOptions);
      }
    });
  }
  $scope.calendarInvite = function(user) {
    $scope.selectedUser = angular.copy(user);
    var selectedUser = $scope.selectedUser

    $modal.open({
      templateUrl: 'sendInvite.html',
      backdrop: true,
      windowClass: 'modal',
      controller: function ($scope, $modalInstance, $log, selectedUser) {
        $scope.selectedUser = selectedUser;
        $scope.selectedUser.inviteUrl = null;
        $scope.selectedUser.inviteNotCreated = false;
        $scope.selectedUser.inviteSearchFailed = false;
        
        $scope.sendInvite = function() {
          sendCalendarInvite($scope.selectedUser.email);
          $modalInstance.dismiss('cancel');
        };
        $scope.cancel = function() {
          $modalInstance.dismiss('cancel');
        };

        function init() {
          userService.getInviteData($scope.selectedUser.id, $scope.selectedUser.email)
          .then(function(result) {
            if (result.data) {
              $scope.selectedUser.inviteUrl = result.data.inviteUrl;
            } else {
              $scope.selectedUser.inviteNotCreated = true;
            }
          })
          .catch(function onError(resp) {
            $scope.selectedUser.inviteSearchFailed = true;
          });
        }
        init();
      },
      resolve: {
        selectedUser: function() {
          return $scope.selectedUser;
        }
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