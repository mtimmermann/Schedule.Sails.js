angular.module('UserModule', ['ngRoute', 'angularUtils.directives.dirPagination', 'ui.bootstrap', 'toastr', 'compareTo', 'ngFocus']);

//angular.module('UserModule').config(function($stateProvider, $httpProvider) {
angular.module('UserModule').config(function($routeProvider) {

  $routeProvider
  .when('/', {
    title: 'Users',
    templateUrl: '/templates/admin/user/list.tpl.html',
    controller: 'UserListController'
  })
  .when('/edit/:id', {
    title: 'Edit User',
    templateUrl: '/templates/admin/user/edit.tpl.html',
    controller: 'UserEditController'
  })
  .when('/password/:id', {
    title: 'Change Password',
    templateUrl: '/templates/admin/user/password.tpl.html',
    controller: 'UserPasswordController'
  })
  .when('/delete/:id', {
    title: 'Delete User Confirmation',
    templateUrl: '/templates/admin/user/delete.tpl.html',
    controller: 'UserDeleteController'
  })
  .otherwise({
    redirectTo: '/'
  });

});
