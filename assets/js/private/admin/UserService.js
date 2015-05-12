angular.module('UserModule').run(['$location', '$rootScope', function($location, $rootScope) {
  $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
    $rootScope.title = current.$$route.title;
  });
}]);

angular.module('UserModule').factory("userService", ['$http', function($http) {
  var serviceBase = '/adminpanel/users/';

  return {
    getUsers: function (page, pageSize, sort, sortDir, filter) {
      return $http.get(serviceBase + '?page='+ page +'&limit='+ pageSize +'&sort='+ sort +'&sortDir='+ sortDir +'&filter='+ filter);
    },

    getUser: function(userId) {
      return $http.get(serviceBase + userId);
    },

    updateUser: function(user, csrf) {
      return $http.put(serviceBase, { user: user, _csrf: csrf });
    },

    deleteUser: function(userId, csrf) {
      return $http.delete(serviceBase + userId +'?_csrf='+ encodeURIComponent(csrf));
    },

    updatePassword: function(userId, password, csrf) {
      return $http.put(serviceBase + 'password', { id: userId, password: password, _csrf: csrf });
    },

    getRoles: function() {
      return $http.get('/adminpanel/roles');
    },

    sendCalenderInvite: function(email) {
      return $http.get('/schedule/invite?email='+ email);
    },

    getInviteData: function(userId, email) {
      return $http.get('/schedule/invite/find?id='+ userId +'&email='+ email);
    }
  };
}]);