angular.module("app").directive('username', function($q, $timeout, mvUser, socketio) {
    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            var usernames = [];
            var idUsernames = [];
            mvUser.query().$promise.then(function (result) {
                result.data.forEach(function (user) {
                    idUsernames.push(user._id);
                    usernames.push(user.username.toUpperCase());
                });
            });
            socketio.on('createUserServerOnly', function (data) {
                idUsernames.push(data._id);
                usernames.push(data.username.toUpperCase());
            });
            socketio.on('updateUserServerOnly', function (data) {
                usernames[idUsernames.indexOf(data._id)] = data.username.toUpperCase();
            });
            socketio.on('deleteUserServerOnly', function (data) {
                idUsernames.splice(idUsernames.indexOf(data._id), 1);
                usernames.splice(idUsernames.indexOf(data._id), 1);
            });
            ctrl.$asyncValidators.username = function(modelValue, viewValue) {
                if (ctrl.$isEmpty(modelValue)) {
                    return $q.when();
                }

                var def = $q.defer();
                if (usernames.indexOf(modelValue.toUpperCase()) === -1) {
                    def.resolve();
                } else {
                    def.reject();
                }
                return def.promise;
            };
        }
    };
});

angular.module("app").directive('emaila', function($q, $timeout, mvUser, socketio) {
    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            var emails = [];
            var idEmails = [];
            mvUser.query().$promise.then(function (result) {
                result.data.forEach(function (user) {
                    idEmails.push(user._id);
                    emails.push(user.email.toUpperCase());
                });
            });
            socketio.on('createUserServerOnly', function (data) {
                idEmails.push(data._id);
                emails.push(data.email.toUpperCase());
            });
            socketio.on('updateUserServerOnly', function (data) {
                emails[idEmails.indexOf(data._id)] = data.email.toUpperCase();
            });
            socketio.on('deleteUserServerOnly', function (data) {
                idEmails.splice(idEmails.indexOf(data._id), 1);
                emails.splice(idEmails.indexOf(data._id), 1);
            });
            ctrl.$asyncValidators.emaila = function(modelValue, viewValue) {

                if (ctrl.$isEmpty(modelValue)) {
                    return $q.when();
                }

                var def = $q.defer();
                if (emails.indexOf(modelValue.toUpperCase()) === -1) {
                    def.resolve();
                } else {
                    def.reject();
                }
                return def.promise;
            };
        }
    };
});
angular.module("app").directive('nameproduct', function($q, $timeout, mvProduct, socketio) {
    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            var products = [];
            mvProduct.query().$promise.then(function (result) {
                result.data.forEach(function (product) {
                    products.push(product);
                });
            });
            socketio.on('createProduct', function (data) {
                products.push(data);
            });
            socketio.on('updateProduct', function (data) {
                products.forEach(function (currentData) {
                    if (currentData._id === data._id) {
                        return angular.extend(currentData, data);
                    }
                });
            });
            socketio.on('deleteProduct', function (data) {
                products.forEach(function (currentData) {
                    if (currentData._id === data._id) {
                        return products.splice(products.indexOf(currentData), 1);
                    }
                });
            });
            ctrl.$asyncValidators.nameproduct = function(modelValue, viewValue) {
                var nameProducts = [];
                products.forEach(function (product) {
                    if (product.manufactureId === attrs.manufacture) {
                        nameProducts.push(product.name.toUpperCase());
                    }
                });
                if (ctrl.$isEmpty(modelValue)) {
                    return $q.when();
                }

                var def = $q.defer();
                if (nameProducts.indexOf(modelValue.toUpperCase()) === -1) {
                    def.resolve();
                } else {
                    def.reject();
                }
                return def.promise;
            };
        }
    };
});
angular.module("app").directive('manufacture', function($q, $timeout, mvManufacture, socketio) {
    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            var manufactures = [];
            var idManufactures = [];
            mvManufacture.query().$promise.then(function (result) {
                result.data.forEach(function (manufacture) {
                    idManufactures.push(manufacture._id);
                    manufactures.push(manufacture.name.toUpperCase());
                });
            });
            socketio.on('createManufacture', function (data) {
                idManufactures.push(data._id);
                manufactures.push(data.name.toUpperCase());
            });
            socketio.on('updateManufacture', function (data) {
                manufactures[idManufactures.indexOf(data._id)] = data.name.toUpperCase();
            });
            socketio.on('deleteManufacture', function (data) {
                idManufactures.splice(idManufactures.indexOf(data._id), 1);
                manufactures.splice(idManufactures.indexOf(data._id), 1);
            });
            ctrl.$asyncValidators.manufacture = function(modelValue, viewValue) {
                if (ctrl.$isEmpty(modelValue)) {
                    return $q.when();
                }

                var def = $q.defer();
                if (manufactures.indexOf(modelValue.toUpperCase()) === -1) {
                    def.resolve();
                } else {
                    def.reject();
                }
                return def.promise;
            };
        }
    };
});
angular.module("app").directive('brand', function($q, $timeout, mvBrand, socketio) {
    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            var brands = [];
            var idBrands = [];
            mvBrand.query().$promise.then(function (result) {
                result.data.forEach(function (brand) {
                    idBrands.push(brand._id);
                    brands.push(brand.name.toUpperCase());
                });
            });
            socketio.on('createBrand', function (data) {
                idBrands.push(data._id);
                brands.push(data.name.toUpperCase());
            });
            socketio.on('updateBrand', function (data) {
                brands[idBrands.indexOf(data._id)] = data.name.toUpperCase();
            });
            socketio.on('deleteBrand', function (data) {
                idBrands.splice(idBrands.indexOf(data._id), 1);
                brands.splice(idBrands.indexOf(data._id), 1);
            });
            ctrl.$asyncValidators.brand = function(modelValue, viewValue) {
                if (ctrl.$isEmpty(modelValue)) {
                    return $q.when();
                }

                var def = $q.defer();
                if (brands.indexOf(modelValue.toUpperCase()) === -1) {
                    def.resolve();
                } else {
                    def.reject();
                }
                return def.promise;
            };
        }
    };
});
angular.module("app").directive('vnumberbill', function($q, $timeout, mvImportGood, socketio) {
    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            var numberBill = [];
            var idnNumberBill = [];
            mvImportGood.query().$promise.then(function (result) {
                result.data.forEach(function (importGood) {
                    idnNumberBill.push(importGood._id);
                    numberBill.push(importGood.numberBill.toUpperCase());
                });
            });
            socketio.on('createImportGood', function (data) {
                idnNumberBill.push(data._id);
                numberBill.push(data.numberBill.toUpperCase());
            });
            socketio.on('updateImportGood', function (data) {
                numberBill[idnNumberBill.indexOf(data._id)] = data.numberBill.toUpperCase();
            });
            socketio.on('deleteImportGood', function (data) {
                idnNumberBill.splice(idnNumberBill.indexOf(data._id), 1);
                numberBill.splice(idnNumberBill.indexOf(data._id), 1);
            });
            ctrl.$asyncValidators.vnumberbill = function(modelValue, viewValue) {
                if (ctrl.$isEmpty(modelValue)) {
                    return $q.when();
                }

                var def = $q.defer();
                if (numberBill.indexOf(modelValue.toUpperCase()) === -1) {
                    def.resolve();
                } else {
                    def.reject();
                }
                return def.promise;
            };
        }
    };
});