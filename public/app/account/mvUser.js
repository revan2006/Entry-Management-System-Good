angular.module("app").factory("mvUser", function ($resource) {
    var UserResource = $resource('/api/users/:id', {_id: "@id"}, {
        get: {method: "PUT", isArray: false},
        update: {method: "PUT", isArray: false},
        delete: {method: "PATCH", isArray: false},
        query: {method: "GET", isArray: false}
    });
    UserResource.prototype.isAdmin = function () {
        return this.roles && this.roles.indexOf('admin') > -1;
    };
    return UserResource
});