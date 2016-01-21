angular.module("app").controller("mvProfileCtrl", function ($scope, mvAuth, mvIdentity, mvNotifier ) {
    $scope.username = mvIdentity.currentUser.username;
    $scope.email = mvIdentity.currentUser.email;
    $scope.fname = mvIdentity.currentUser.fullName;
    $scope.telephone = mvIdentity.currentUser.telephone;

    $scope.update = function () {
        var newUserData = {
            username: $scope.username,
            email: $scope.email,
            fullName: $scope.fname,
            telephone: $scope.telephone
        };
        if($scope.password && $scope.password.length >0) {
            newUserData.password = $scope.password;
        }
        mvAuth.updateCurrentUser(newUserData).then(function () {
            mvNotifier.notify('Tài khoản đã được thay đổi!');
        }, function (reason) {
            mvNotifier.error(reason);
        })
    };
});