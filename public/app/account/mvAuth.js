angular.module("app").factory("mvAuth", function ($http, mvIdentity, $q, mvUser) {
    return {
        authenticateUser: function (username, password) {
            var dfd = $q.defer();
            $http.post('/login', {username: username, password: password}).then(function (response) {
                if (response.data.success) {
                    var user = new mvUser();
                    angular.extend(user, response.data.user);
                    mvIdentity.currentUser = user;
                    dfd.resolve({allow: true, reason: response.data.reason});
                } else {
                    dfd.resolve({allow: false, reason: response.data.reason});
                }
            });
            return dfd.promise;
        },

        getUser: function(data) {
            var newUser = new mvUser(data);
            var dfd = $q.defer();

            newUser.$get().then(function () {
                dfd.resolve();
            }, function () {
                dfd.reject();
            });
            return dfd.promise;
        },

        createUser: function(newUserData) {
            var newUser = new mvUser(newUserData);
            var dfd = $q.defer();

            newUser.$save().then(function () {
                dfd.resolve();
            }, function (response) {
                dfd.reject(response.data.reason);
            });
            return dfd.promise;
        },

        updateCurrentUser: function(newUserData) {
            var dfd = $q.defer();
            var clone = angular.copy(mvIdentity.currentUser);
            angular.extend(clone, newUserData);
            clone.$update().then(function() {
                mvIdentity.currentUser = clone;
                dfd.resolve();
            }, function(response) {
                dfd.reject(response.data.reason);
            });
            return dfd.promise;
        },

        updateUser: function(boolean, user) {
            var dfd = $q.defer();
            var clone = angular.copy(new mvUser(user));
            angular.extend(clone, {allow: boolean});
            clone.$delete().then(function(user) {
                dfd.resolve(user);
            }, function(response) {
                dfd.reject(response.data.reason);
            });
            return dfd.promise;
        },

        logoutUser: function() {
            var dfd = $q.defer();
            $http.post('/logout', {logout: true}).then(function () {
                mvIdentity.currentUser = undefined;
                dfd.resolve();
            });
            return dfd.promise;
        },

        deleteUser: function(userDelete) {
            var dfd = $q.defer(),
                userId = new mvUser(userDelete);
            userId.$delete().then(function() {
                dfd.resolve();
            }, function(response) {
                dfd.reject(response.data.reason);
            });
            return dfd.promise;
        },

        authorizeCurrentUserForRoute: function(role) {
            if(mvIdentity.isAuthorized(role)) return true;
            else return $q.reject('not authorized');
        },
        authorizeAuthenticatedUserForRoute: function() {
            if(mvIdentity.isAuthenticated()) return true;
            else return $q.reject('not authorize');
        }
    }
});