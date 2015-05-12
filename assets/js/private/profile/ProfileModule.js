angular.module('ProfileModule', ['ngRoute', 'ui.bootstrap', 'toastr', 'compareTo']);

angular.module('ProfileModule').config(function($routeProvider) {

  $routeProvider
  .when('/', {
    title: 'Edit',
    templateUrl: '/templates/admin/user/edit.tpl.html',
    controller: 'UserEditController'
  })
  .when('/password/:id', {
    title: 'Change Password',
    templateUrl: '/templates/admin/user/password.tpl.html',
    controller: 'UserPasswordController'
  })
  .otherwise({
    redirectTo: '/'
  });

});

