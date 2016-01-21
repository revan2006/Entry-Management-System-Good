angular.module("app").controller("mvSignupCtrl", function ($scope, mvUser, mvNotifier, $location, mvAuth) {
    $scope.signup = function () {
        var newUserData = {
            username: $scope.username,
            email: $scope.email,
            password: $scope.password,
            fullName: $scope.fname,
            telephone: $scope.telephone
        };
        mvAuth.createUser(newUserData).then(function () {
            mvNotifier.notify('Tài khoản đã được tạo!');
            $scope.signupForm.$setUntouched();
            $scope.username = '';
            $scope.email = '';
            $scope.password = '';
            $scope.fname = '';
            $scope.telephone = '';
        }, function (reason) {
            mvNotifier.error(reason);
        })
    };
});