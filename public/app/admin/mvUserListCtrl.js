angular.module("app").controller("mvUserListCtrl", function ($scope, mvUser, mvAuth, mvNotifier, socketio, ngTableParams, $filter) {
    var users;
    mvUser.query().$promise.then(function(result) {
        users = result.data;
        return tableSetup(users);
    });

    $scope.applyGlobalSearch = function(data) {
        $scope.globalSearchTerm = data.searchTerm.$modelValue;
        if (data.inverted.$viewValue){
            $scope.globalSearchTerm = "!" + $scope.globalSearchTerm;
        }
        return tableSetup(users);
    };

    $scope.userDelete = function (deleteUserData) {
        mvAuth.deleteUser(deleteUserData).then(function () {
            mvNotifier.notify('Bạn đã xóa một tài khoản!');
        }, function (reason) {
            mvNotifier.error(reason);
        })
    };

    $scope.userAllow = function (boolean, user) {
        mvAuth.updateUser(boolean, user).then(function () {
            if(boolean) mvNotifier.notify('Tài khoản đã được kich hoạt!');
            else mvNotifier.error('Tài khoản đã được chặn!');
        }, function (reason) {
            mvNotifier.error(reason);
        })
    };

    socketio.on('allowUser', function (data) {
        users.forEach(function (user) {
            if (user._id === data._id) {
                user.allow = data.allow;
                return user.dateModify = data.dateModify;
            }
        });
        return tableSetup(users);
    });

    socketio.on('deleteUser', function (data) {
        users.forEach(function (user) {
            if (user._id === data._id) {
                return users.splice(users.indexOf(user), 1);

            }
        });
        return tableSetup(users);
    });

    socketio.on('updateUserServer', function (data) {
        users.forEach(function (user) {
            if (user._id === data._id) {
                return angular.extend(user, data);
            }
        });
    });

    socketio.on('createUserServer', function (data) {
        users.push(data);
        return tableSetup(users);
    });

    function tableSetup(dataTable) {
        var page = $scope.dataTable && $scope.dataTable.page() > 1 ? $scope.dataTable.page() : 1,
            filerNow = $scope.globalSearchTerm ? $scope.globalSearchTerm : '',
            sorting = $scope.dataTable && $scope.dataTable.sorting() !== {dateCreate: "desc"} ? $scope.dataTable.sorting() : {dateCreate: "desc"},
            count = $scope.dataTable && $scope.dataTable.count() !== 5 ? $scope.dataTable.count() : 5,
            group = $scope.dataTable && $scope.dataTable.group() !== {$: "asc"} ? $scope.dataTable.group() : {$: "asc"};
        $scope.dataTable = new ngTableParams({
            page: page,
            count: count,
            group: group,
            sorting: sorting,
            filter: { $: filerNow }
        }, {
            dataset: dataTable
        });
    }
});