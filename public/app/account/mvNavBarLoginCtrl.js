angular.module("app").controller("mvNavBarLoginCtrl", function ($scope, $http, mvIdentity, mvNotifier, mvAuth, $location, mvCachedProduct) {
    $scope.identity = mvIdentity;
    $scope.signin = function (username, password) {
        mvAuth.authenticateUser(username, password).then(function (success) {
            if (success.allow) {
                mvNotifier.notify(success.reason);
                $location.path('/products');
            }else mvNotifier.error(success.reason);
        });
    };

    $scope.signout = function() {
        mvAuth.logoutUser().then(function() {
            $scope.username = "";
            $scope.password = "";
            mvCachedProduct.query(false);
            mvNotifier.notify('Bạn đã Đăng xuất!');
            $location.path('/');
        })
    };
});