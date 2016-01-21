angular.module("app", ["ngResource", "ngRoute", "ngSanitize","ui.bootstrap","ngAnimate","ngTable", "angularMoment", "ngMessages", "ui.mask","ui.select"]);
angular.module("app").config(function ($routeProvider, $locationProvider) {
    var routeRoleChecks = {
        admin: { auth: function (mvAuth) {
                return mvAuth.authorizeCurrentUserForRoute('admin');
        }},
        user: {auth: function (mvAuth) {
            return mvAuth.authorizeAuthenticatedUserForRoute();
        }}
    };
    $locationProvider.html5Mode(true);
    $routeProvider
        .when("/", {
            templateUrl: "/partials/main/main",
            controller: "mvMainCtrl"
        })
        .when("/admin/users", {
            templateUrl: "/partials/admin/user-list",
            controller: "mvUserListCtrl",
            resolve: routeRoleChecks.admin
        })
        .when("/signup", {
            templateUrl: "/partials/account/signup",
            controller: "mvSignupCtrl"
        })
        .when("/profile", {
            templateUrl: "/partials/account/profile",
            controller: "mvProfileCtrl",
            resolve: routeRoleChecks.user
        })
        .when("/products", {
            templateUrl: "/partials/products/product-list",
            controller: "mvProductListCtrl",
            resolve: routeRoleChecks.user
        })
        .when("/manufactures", {
            templateUrl: "/partials/manufactures/manufacture-list",
            controller: "mvManufactureListCtrl",
            resolve: routeRoleChecks.user
        })
        .when("/brands", {
            templateUrl: "/partials/brands/brand-list",
            controller: "mvBrandListCtrl",
            resolve: routeRoleChecks.user
        })
        .when("/importgoods", {
            templateUrl: "/partials/importgoods/importgood-list",
            controller: "mvImportGoodListCtrl",
            resolve: routeRoleChecks.user
        })
});
angular.module("app").run(function ($rootScope, $location) {
    $rootScope.$on("$routeChangeError", function (evt, current, previous, rejection) {
        if (rejection === "not authorized") $location.path('/');
        if (rejection === "not authorize") $location.path('/');
    });
});
angular.module("app").directive("demoCustomGroupRow", function() {
    var directive = {
        restrict: 'E',
        replace: true,
        templateUrl: 'customGroupRow.html',
        scope: true,
        controller: 'ngTableGroupRowController',
        controllerAs: 'dctrl'
    };
    return directive;
});
angular.module("app").directive('myEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.myEnter);
                });

                event.preventDefault();
            }
        });
    };
});
angular.module("app").filter("tel", function () {
    return function (tel) {
        if (!tel) { return ''; }

        var value = tel.toString().trim().replace(/^\+/, '');

        if (value.match(/[^0-9]/)) {
            return tel;
        }

        var country, city, number;

        switch (value.length) {
            case 10: // +1PPP####### -> C (PPP) ###-####
                country = 1;
                city = value.slice(0, 3);
                number = value.slice(3);
                break;

            case 11: // +CPPP####### -> CCC (PP) ###-####
                country = value[0];
                city = value.slice(1, 4);
                number = value.slice(4);
                break;

            case 12: // +CCCPP####### -> CCC (PP) ###-####
                country = value.slice(0, 3);
                city = value.slice(3, 5);
                number = value.slice(5);
                break;

            default:
                return tel;
        }

        if (country == 1) {
            country = "";
        }

        number = number.slice(0, 3) + '.' + number.slice(3);

        return (country + "" + city + "." + number).trim();
    };
});

angular.module("app").filter("name", function () {
    return function (arr, id) {
        var name = '';
        angular.forEach(arr, function (data) {
            if (data._id === id) {
                return name = data.name;
            }
        });
        return name;
    };
});
angular.module("app").filter("fullName", function () {
    return function (arr, id) {
        var name = '';
        angular.forEach(arr, function (data) {
            if (data._id === id) {
                return name = data.fullName;
            }
        });
        return name;
    };
});

moment.locale("vi", {
    relativeTime : {
        future: "Sau %s",
        past:   "%s trước",
        s:  "Vài giây",
        m:  "1 phút",
        mm: "%d phút",
        h:  "1 giờ",
        hh: "%d giờ",
        d:  "1 ngày",
        dd: "%d ngày",
        M:  "1 tháng",
        MM: "%d tháng",
        y:  "1 năm",
        yy: "%d năm"
    }
});
