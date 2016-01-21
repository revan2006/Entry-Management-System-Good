angular.module("app").factory("mvBrand", function ($resource) {
    var BrandResource = $resource("/api/brands/:_id", {_id: "@id"}, {
        update: {method: "PUT", isArray: false},
        delete: {method: "PATCH", isArray: false},
        query: {method: "GET", isArray: false}
    });
    return BrandResource;
});