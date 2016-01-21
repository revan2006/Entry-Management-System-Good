angular.module("app").factory("mvImportGood", function ($resource) {
    var ImportGoodResource = $resource("/api/importgoods/:_id", {_id: "@id"}, {
        update: {method: "PUT", isArray: false},
        delete: {method: "PATCH", isArray: false},
        query: {method: "GET", isArray: false}
    });
    return ImportGoodResource;
});