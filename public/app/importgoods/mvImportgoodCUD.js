angular.module("app").factory("mvImportGoodCUD", function ($q, mvImportGood) {
    return {
        createData: function(newData) {
            var data = new mvImportGood(newData);
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
            var clone = angular.copy(new mvImportGood(data));
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
                data = new mvImportGood(dataDelete);
            data.$delete().then(function() {
                dfd.resolve();
            }, function(response) {
                dfd.reject(response.data.reason);
            });
            return dfd.promise;
        }

    }
});