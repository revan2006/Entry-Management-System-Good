angular.module("app").controller("mvProductListCtrl", function ($scope, mvProduct, mvManufacture, mvBrand, mvIdentity, $uibModal, socketio, ngTableParams) {
    var product;
    mvManufacture.query().$promise.then(function(result) {
        $scope.manufactures = result.data;
    });
    mvBrand.query().$promise.then(function(result) {
        $scope.brands = result.data;
    });
    mvProduct.query().$promise.then(function(result) {
        product = result.data;
        return tableSetup(product);
    });
    $scope.identity = mvIdentity;

    $scope.applyGlobalSearch = function(data) {
        $scope.globalSearchTerm = data.searchTerm.$modelValue;
        if (data.inverted.$viewValue){
            $scope.globalSearchTerm = "!" + $scope.globalSearchTerm;
        }
        tableSetup(product);
    };

    $scope.GetSummOfAges = function (group) {
        var summ = 0;
        for (var i in group.data) {
            summ = summ + Number(group.data[i].quantity);
        }
        return summ;
    };

    $scope.openModel = function (data) {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'myModalContent',
            controller: 'ModalProductCtrl',
            scope: $scope,
            size: "lg",
            windowClass: "modal-product",
            resolve: {
                dataModal: function () {
                    return data;
                }
            }
        });
        modalInstance.result.then(function () {
        }, function () {
        });
    };

    $scope.confirmModel = function (data) {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'myModalConfirm',
            controller: 'ModalProductConfirmCtrl',
            scope: $scope,
            size: "md",
            windowClass: "modal-product-confirm",
            resolve: {
                dataModal: function () {
                    return data;
                }
            }
        });
        modalInstance.result.then(function () {
        }, function () {
        });
    };

    socketio.on('createProduct', function (data) {
        product.push(data);
        tableSetup(product)
    });

    socketio.on('updateProduct',function(data) {
        product.forEach(function (currentData) {
            if (currentData._id === data._id) {
                return angular.extend(currentData, data);
            }
        });
        tableSetup(product)
    });

    socketio.on('deleteProduct', function (data) {
        product.forEach(function (currentData) {
            if (currentData._id === data._id) {
                return product.splice(product.indexOf(currentData), 1);
            }
        });
        tableSetup(product)
    });

    function tableSetup(dataTable) {
        var page = $scope.dataTable && $scope.dataTable.page() > 1 ? $scope.dataTable.page() : 1,
            filerNow = $scope.globalSearchTerm ? $scope.globalSearchTerm : '',
            sorting = $scope.dataTable && $scope.dataTable.sorting() !== {dateCreate: "desc"} ? $scope.dataTable.sorting() : {dateCreate: "desc"},
            count = $scope.dataTable && $scope.dataTable.count() !== 5 ? $scope.dataTable.count() : 5,
            group = $scope.dataTable && $scope.dataTable.group() !== {manufactureId: "asc"} ? $scope.dataTable.group() : {manufactureId: "asc"};

        $scope.dataTable = new ngTableParams({
            page: page,
            count: count,
            group: group,
            sorting: sorting,
            filter: { $: filerNow }
        }, {
            dataset: dataTable
        });
    }
});

angular.module('app').controller('ModalProductCtrl', function ($scope, $uibModalInstance, mvProductCUD, mvNotifier, dataModal, socketio) {
    $scope.manufactureId = {};
    $scope.brandId = {};
    if(dataModal){
        $scope.modalTitle = "Chỉnh sửa sản phẩm";
        $scope.modalButton = "Chỉnh sửa";

        $scope.manufactures.forEach(function (currentData,index) {
            if (currentData._id === dataModal.manufactureId) {
                $scope.manufactureId.selected = $scope.manufactures[index];
            }
        });

        $scope.brands.forEach(function (currentData,index) {
            if (currentData._id === dataModal.brandId) {
                $scope.brandId.selected = $scope.brands[index];
            }
        });
        $scope.name = dataModal.name;
        $scope.quantity = dataModal.quantity;
        $scope.price = dataModal.price;

        $scope.submitModal = function() {
            var newData = {
                manufactureId: $scope.manufactureId.selected._id,
                brandId: $scope.brandId.selected._id,
                name: $scope.name,
                quantity: $scope.quantity,
                price: $scope.price
            };
            mvProductCUD.updateCurrentData(dataModal, newData).then(function () {
            }, function (reason) {
                return mvNotifier.error(reason);
            })
        };
    }else {
        $scope.modalTitle = "Tạo sản phẩm mới";
        $scope.modalButton = "Tạo mới";
        $scope.manufactureId.selected = $scope.manufactures[0];
        $scope.brandId.selected = $scope.brands[0];
        $scope.submitModal = function () {
            var newData = {
                manufactureId: $scope.manufactureId.selected._id,
                brandId: $scope.brandId.selected._id,
                name: $scope.name,
                quantity: $scope.quantity,
                price: $scope.price
            };
            mvProductCUD.createData(newData).then(function () {
                mvNotifier.notify('Bạn đã tạo một Sản phẩm!');
                $scope.productForm.$setUntouched();
                $scope.manufactureId.selected = $scope.manufactures[0];
                $scope.brandId.selected = $scope.brands[0];
                $scope.name = null;
                $scope.quantity = null;
                $scope.price = null;
            }, function (reason) {
                return mvNotifier.error(reason);
            })
        };
    }
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    $scope.clearName = function() {
        $scope.productForm.$setUntouched();
        $scope.name = null;
    };
    socketio.on('updateProduct',function(data) {
        if(dataModal) {
            if (dataModal._id === data._id && $('.modal-product').hasClass('in')) {
                $uibModalInstance.dismiss('cancel');
                mvNotifier.notify('Sản phẩm đã được chỉnh sửa!');
            }
        }
    });
    socketio.on('deleteProduct', function (data) {
        if(dataModal) {
            if (dataModal._id === data._id && $('.modal-product').hasClass('in')) {
                $uibModalInstance.dismiss('cancel');
                mvNotifier.error('Sản phẩm đã được xóa!');
            }
        }

    });
});
angular.module('app').controller('ModalProductConfirmCtrl', function ($scope, $uibModalInstance, mvProductCUD, mvNotifier, dataModal, socketio) {
    $scope.modalTitle = "Bạn thật sử muốn xóa!";
    $scope.modalContent = dataModal;
    $scope.modalButton = "Xóa";
    $scope.submitModal = function () {
        mvProductCUD.deleteData(dataModal).then(function () {
            mvNotifier.notify('Bạn đã xóa một Sản phẩm!');
        }, function (reason) {
            mvNotifier.error(reason);
        })
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    socketio.on('deleteProduct', function (data) {
        if(dataModal._id) {
            if (dataModal._id === data._id && $('.modal-product-confirm').hasClass('in')) {
                $uibModalInstance.dismiss('cancel');
            }
        }
    });
});