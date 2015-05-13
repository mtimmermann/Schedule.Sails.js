angular.module('SignupModule').controller('SignupController', ['$scope', '$http', 'loginService', 'toastr', function($scope, $http, loginService, toastr) {

    // Setup loading state
    $scope.signupForm = { loading: false }

    $scope.submitSignupForm = function() {

        // Set the loading state, show loading spinner
        $scope.signupForm.loading = true;

        $http.post('/auth/local/register', {
            username: $scope.signupForm.username,
            email: $scope.signupForm.email,
            password: $scope.signupForm.password,
            _csrf: $scope.signupForm._csrf
        })
        .then(function onSuccess(resp) {
            window.location = '/';
        })
        .catch(function onError(resp) {
            if (resp.status === 409 && typeof resp.data === 'string' && resp.data.length > 0) {
                toastr.error(resp.data, 'Error', myApp.locals.toastrOptions);
            } else {
                toastr.error('Unknown error', 'Error', myApp.locals.toastrOptions);
            }
        })
        .finally(function eitherWay() {
            $scope.signupForm.loading = false;
        });
    };

    //$scope.submitLoginForm = function () {
    //    loginService.login($scope);
    //};
}]);
