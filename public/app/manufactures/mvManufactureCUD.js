angular.module("app").factory("mvManufactureCUD", function ($q, mvManufacture) {
    return {
        createData: function(newData) {
            var data = new mvManufacture(newData);
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
            var clone = angular.copy(new mvManufacture(data));
            angular.extend(clone, newData);
            clone.$update().then(function() {
                dfd.resolve();
            }, function(response) {
                dfd.reject(response.data.reason);
            });
            return dfd.promise;
        },
        deleteData: function(dataDelete) {
            var dfd = $q.defer(),
                data = new mvManufacture(dataDelete);
            data.$delete().then(function() {
                dfd.resolve();
            }, function(response) {
                dfd.reject(response.data.reason);
            });
            return dfd.promise;
        }

    }
});