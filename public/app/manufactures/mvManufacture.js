angular.module("app").factory("mvManufacture", function ($resource) {
    var ManufactureResource = $resource("/api/manufactures/:_id", {_id: "@id"}, {
        update: {method: "PUT", isArray: false},
        delete: {method: "PATCH", isArray: false},
        query: {method: "GET", isArray: false}
    });
    return ManufactureResource;
});