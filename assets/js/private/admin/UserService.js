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

    updateUser: function(user) {
      return $http.put(serviceBase, { user: user });
    },

    deleteUser: function(userId) {
      return $http.delete(serviceBase + userId);
    },

    updatePassword: function(userId, password) {
      return $http.put(serviceBase + 'password', { id: userId, password: password });
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