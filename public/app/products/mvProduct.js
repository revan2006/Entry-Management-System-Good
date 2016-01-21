angular.module("app").factory("mvProduct", function ($resource) {
    var ProductResource = $resource("/api/products/:_id", {_id: "@id"}, {
        update: {method: "PUT", isArray: false},
        delete: {method: "PATCH", isArray: false},
        query: {method: "GET", isArray: false}
    });
    return ProductResource;
});
angular.module("app").factory("mvCachedProduct", function (mvProduct) {
    var ProductList;
    return{
        query: function(actives) {
            if(!actives) {
                return ProductList = null;
            } else if(!ProductList) {
                return ProductList = mvProduct.query().$promise.then(function(result) {
                    return result.data;
                });
            } else{
                //socketio.on('createProduct', function (data) {
                //    return ProductList.$$state.value.push(data);
                //});
                //socketio.on('updateProduct',function(data) {
                //    return ProductList = ProductList.then(function(result) {
                //        result.forEach(function (currentData) {
                //            if (currentData._id === data._id) {
                //                return angular.extend(currentData, data);
                //            }
                //        });
                //        return result
                //    });
                //});
                //socketio.on('deleteProduct', function (data) {
                //    return ProductList = ProductList.then(function(result) {
                //        result.splice(result.indexOf(data), 1);
                //        return result
                //    });
                //});
                return ProductList
            }
        }
    };
});