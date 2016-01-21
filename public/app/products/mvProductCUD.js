angular.module("app").factory("mvProductCUD", function ($q, mvProduct) {
    return {
        createData: function(newData) {
            var data = new mvProduct(newData);
            var dfd = $q.defer();

            data.$save().then(function (response) {
                dfd.resolve(response);
            }, function (response) {
                dfd.reject(response.data.reason);
            });
            return dfd.promise;
        },
        updateCurrentData: function(data,newData) {
            var dfd = $q.defer();
            var clone = angular.copy(new mvProduct(data));
            angular.extend(clone, newData);
            clone.$update().then(function() {
                dfd.resolve();
            }, function(response) {
                dfd.reject(response.data.reason);
            });
            return dfd.promise;
        },
        deleteData: function(deletedata) {
            var dfd = $q.defer();
            var data = new mvProduct(deletedata);
            data.$delete().then(function() {
                dfd.resolve();
            }, function(response) {
                dfd.reject(response.data.reason);
            });
            return dfd.promise;
        }

    }
});