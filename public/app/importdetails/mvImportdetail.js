angular.module("app").factory("mvImportDetail", function ($resource) {
    var ImportDetailResource = $resource("/api/importdetails/:_id", {_id: "@id"}, {
        delete: {method: "PATCH", isArray: false},
        query: {method: "GET", isArray: false}
    });
    return ImportDetailResource;
});