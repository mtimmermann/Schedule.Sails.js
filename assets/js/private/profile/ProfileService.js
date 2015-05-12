angular.module('ProfileModule').run(['$location', '$rootScope', function($location, $rootScope) {
  $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
    $rootScope.title = current.$$route.title;
  });
}]);

angular.module('ProfileModule').factory("profileService", ['$http', function($http) {
  var serviceBase = '/profile/';

  return {
    getProfile: function() {
      return $http.get(serviceBase);
    },

    updateProfile: function(user, csrf) {
      return $http.put(serviceBase, { user: user, _csrf: csrf });
    }
  }

}]);