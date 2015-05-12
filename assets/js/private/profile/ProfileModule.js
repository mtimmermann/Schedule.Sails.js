angular.module('ProfileModule', ['ngRoute', 'ui.bootstrap', 'toastr', 'compareTo']);

angular.module('ProfileModule').config(function($routeProvider) {

  $routeProvider
  .when('/', {
    title: 'Edit Profile',
    templateUrl: '/templates/profile/edit.tpl.html',
    controller: 'ProfileEditController'
  })
  .when('/password/:id', {
    title: 'Change Password',
    templateUrl: '/templates/profile/password.tpl.html',
    controller: 'ProfilePasswordController'
  })
  .otherwise({
    redirectTo: '/'
  });

});

