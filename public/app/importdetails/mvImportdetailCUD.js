angular.module("app").factory("mvImportDetailCUD", function ($q, mvImportDetail) {
    return {
        createData: function(newData) {
            var data = new mvImportDetail(newData);
            var dfd = $q.defer();

            data.$save().then(function (response) {
                dfd.resolve(response);
            }, function (response) {
                dfd.reject(response.data.reason);
            });
            return dfd.promise;
        },
        deleteData: function(dataDelete) {
            var dfd = $q.defer(),
                data = new mvImportDetail(dataDelete);
            data.$delete().then(function() {
                dfd.resolve();
            }, function(response) {
                dfd.reject(response.data.reason);
            });
            return dfd.promise;
        }

    }
});