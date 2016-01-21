angular.module("app").controller("mvImportGoodListCtrl", function ($scope, mvManufacture, mvProduct, mvAuth, mvImportGood, mvBrand, mvIdentity, mvImportDetail, $uibModal, socketio, ngTableParams) {
    var ImportGood;
    $scope.hideModal = true;
    mvImportGood.query().$promise.then(function(result) {
        ImportGood = result.data;
        return tableSetup(ImportGood);
    });
    mvImportDetail.query().$promise.then(function(result) {
        return $scope.importdetail = result.data;
    });
    mvManufacture.query().$promise.then(function(result) {
        return $scope.manufactures = result.data;
    });
    mvBrand.query().$promise.then(function(result) {
        return $scope.brands = result.data;
    });
    mvProduct.query().$promise.then(function(result) {
        return $scope.products = result.data;
    });
    $scope.openDatePicker = function() {$scope.popup1.opened = true;};
    $scope.popup1 = {opened: false};
    mvAuth.getUser({getUser: true});
    $scope.identity = mvIdentity;
    socketio.on('getUserServer', function (data) {
        $scope.users = data;
    });

    $scope.applyGlobalSearch = function(data) {
        $scope.globalSearchTerm = data.searchTerm.$modelValue;
        if (data.inverted.$viewValue){
            $scope.globalSearchTerm = "!" + $scope.globalSearchTerm;
        }
        tableSetup(ImportGood);
    };

    $scope.GetSummOfAges = function (group) {
        var summ = 0;
        for (var i in group.data) {
            summ = summ + Number(group.data[i].totalCost);
        }
        return summ;
    };

    $scope.openModel = function (data) {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'myModalContent',
            controller: 'ModalImportGoodCtrl',
            scope: $scope,
            size: "lg",
            windowClass: "modal-importgood",
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
            controller: 'ModalImportGoodConfirmCtrl',
            scope: $scope,
            size: "md",
            windowClass: "modal-importgood-confirm",
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

    $scope.detailModel = function (data) {
        var dataTablet = [];
        $scope.importdetail.forEach(function (currentData) {
            if (currentData.importGoodsId === data._id) {
                dataTablet.push(currentData);
            }
        });
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'myModalDetail',
            controller: 'ModalImportGoodDetailCtrl',
            scope: $scope,
            size: "lg",
            windowClass: "modal-importgood-detail",
            resolve: {
                titleModal: function () {
                    return data;
                },
                dataModal: function () {
                    return dataTablet;
                }
            }
        });
        modalInstance.result.then(function () {
        }, function () {
        });
    };

    socketio.on('createImportDetail', function (data) {
        $scope.importdetail.push(data);
    });

    socketio.on('createImportGood', function (data) {
        ImportGood.push(data);
        tableSetup(ImportGood);
    });

    socketio.on('updateImportGood',function(data) {
        ImportGood.forEach(function (currentData) {
            if (currentData._id === data._id) {
                angular.extend(currentData, data);
            }
        });
        tableSetup(ImportGood);
    });

    socketio.on('deleteImportGood', function (data) {
        ImportGood.forEach(function (currentData) {
            if (currentData._id === data._id) {
                ImportGood.splice(ImportGood.indexOf(currentData), 1);
            }
        });
        tableSetup(ImportGood);
    });

    socketio.on('createManufacture', function (data) {
        $scope.manufactures.push(data);
    });

    socketio.on('updateManufacture',function(data) {
        $scope.manufactures.forEach(function (currentData) {
            if (currentData._id === data._id) {
                return angular.extend(currentData, data);
            }
        });
    });

    socketio.on('deleteManufacture', function (data) {
        $scope.manufactures.forEach(function (currentData) {
            if (currentData._id === data._id) {
                return $scope.manufactures.splice($scope.manufactures.indexOf(currentData), 1);
            }
        });
    });

    socketio.on('createProduct', function (data) {
        $scope.products.push(data);
    });

    socketio.on('updateProduct',function(data) {
        $scope.products.forEach(function (currentData) {
            if (currentData._id === data._id) {
                return angular.extend(currentData, data);
            }
        });
    });

    socketio.on('deleteProduct', function (data) {
        $scope.products.forEach(function (currentData) {
            if (currentData._id === data._id) {
                return $scope.products.splice($scope.products.indexOf(currentData), 1);
            }
        });
    });

    socketio.on('deleteUser', function (data) {
        $scope.users.forEach(function (user) {
            if (user._id === data._id) {
                return $scope.users.splice($scope.users.indexOf(user), 1);
            }
        });
    });

    socketio.on('updateUserServer', function (data) {
        $scope.users.forEach(function (user) {
            if (user._id === data._id) {
                return angular.extend(user, data);
            }
        });
    });

    socketio.on('createUserServer', function (data) {
        return $scope.users.push(data);
    });

    function tableSetup(dataTable) {
        var page = $scope.dataTable && $scope.dataTable.page() > 1 ? $scope.dataTable.page() : 1,
            filerNow = $scope.globalSearchTerm ? $scope.globalSearchTerm : '',
            sorting = $scope.dataTable && $scope.dataTable.sorting() !== {dateCreate: "desc"} ? $scope.dataTable.sorting() : {dateCreate: "desc"},
            count = $scope.dataTable && $scope.dataTable.count() !== 5 ? $scope.dataTable.count() : 5,
            group = $scope.dataTable && $scope.dataTable.group() !== {dayImport: "desc"} ? $scope.dataTable.group() : {dayImport: "desc"};
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
angular.module('app').controller('ModalImportGoodCtrl', function ($scope, $uibModalInstance, mvImportGoodCUD, mvImportDetailCUD, mvNotifier, dataModal, socketio, mvIdentity) {
    $scope.manufactureId = {};
    $scope.productsImport = [];
    $scope.productsSelect = [];
    if(dataModal){
        $scope.modalTitle = "Chỉnh sửa đợt nhập hàng";
        $scope.modalButton = "Chỉnh sửa";
        $scope.importGoodEdit = false;

        $scope.manufactures.forEach(function (currentData,index) {
            if (currentData._id === dataModal.manufactureId) {
                $scope.manufactureId.selected = $scope.manufactures[index];
            }
        });
        $scope.importdetail.forEach(function (currentData) {
            if (currentData.importGoodsId === dataModal._id) {
                $scope.productsImport.push(currentData);
            }
        });
        $scope.dayImport = new Date(parseInt(dataModal.dayImport));
        $scope.numberBill = dataModal.numberBill;
        $scope.totalCost = dataModal.totalCost;
        $scope.note = dataModal.note;

        $scope.submitModal = function() {
            var newData = {
                manufactureId: $scope.manufactureId.selected._id,
                dayImport: $scope.dayImport.setHours(0,0,0,0),
                numberBill: $scope.numberBill,
                totalCost: $scope.totalCost,
                note: $scope.note,
                userId: mvIdentity.currentUser._id
            };
            mvImportGoodCUD.updateCurrentData(dataModal, newData).then(function () {

            }, function (reason) {
                return mvNotifier.error(reason);
            })
        };
    }else {
        $scope.modalTitle = "Tạo nhập hàng mới";
        $scope.modalButton = "Tạo mới";
        $scope.dayImport = new Date();
        $scope.importGoodEdit = true;
        $scope.manufactureId.selected = '';

        $scope.productsImport = [{
            id: $scope.productsImport.length,
            productId: {selected: ''},
            quantityImport: '',
            priceEach: '',
            totalPrice:''
        }];
        $scope.submitModal = function () {
            var newData = {
                manufactureId: $scope.manufactureId.selected._id,
                dayImport: $scope.dayImport.setHours(0,0,0,0),
                numberBill: $scope.numberBill,
                totalCost: $scope.totalCost,
                note: $scope.note,
                userId: mvIdentity.currentUser._id
            };
            mvImportGoodCUD.createData(newData).then(function (data) {
                $scope.productsImport.forEach(function (product) {
                    var newData = {
                        importGoodsId: data._id,
                        productId: product.productId.selected._id,
                        quantityImport: product.quantityImport,
                        priceEach: product.priceEach,
                        totalPrice: product.priceEach * product.quantityImport
                    };
                    mvImportDetailCUD.createData(newData).then(function() {
                    }, function (reason) {
                        return mvNotifier.error(reason);
                    })
                });

                mvNotifier.notify('Bạn mới thêm một đợt nhập hàng mới!');
                $scope.importGoodForm.$setUntouched();
                $scope.manufactureId.selected = '';
                $scope.numberBill = '';
                $scope.totalCost = '';
                $scope.note = '';
                $scope.productsImport = [{
                    id: $scope.productsImport.length,
                    productId: {selected: $scope.productsSelect[0]},
                    quantityImport: '',
                    priceEach: '',
                    totalPrice:''
                }];
            }, function (reason) {
                return mvNotifier.error(reason);
            })
        };
    }
    $scope.addNewProduct = function () {
        $scope.productsImport.push({
            id: $scope.productsImport.length,
            productId: {selected: ''},
            quantityImport: '',
            priceEach: '',
            totalPrice:''
        });
    };
    $scope.selectProduct = function() {
        $scope.productsSelect = [];
        $scope.products.forEach(function (product) {
            if (product.manufactureId === $scope.manufactureId.selected._id) {
                $scope.productsSelect.push(product);
            }
        });
        if($scope.productsSelect.length < 1) {
            $scope.productsImport.forEach(function (product) {
                product.productId.selected = "";
            });
        }else {
            $scope.productsImport.forEach(function (product) {
                product.productId.selected = $scope.productsSelect[0];
            });
        }
    };
    $scope.removeNewProduct = function (data) {
        $scope.productsImport.forEach(function (currentData) {
            if (currentData.id === data.id) {
                $scope.productsImport.splice($scope.productsImport.indexOf(currentData), 1);
            }
        });
    };

    $scope.sumTotalCost = function () {
        var total = 0;
        $scope.productsImport.forEach(function (product) {
            total += parseInt(product.priceEach * product.quantityImport);
        });
        $scope.totalCost = total;
        return total;
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    socketio.on('updateImportGood',function(data) {
        if(dataModal) {
            if (dataModal._id === data._id && $('.modal-importgood').hasClass('in')) {
                $uibModalInstance.dismiss('cancel');
                mvNotifier.notify('Đợt nhập hàng đã được chỉnh sửa!');
            }
        }
    });
    socketio.on('deleteImportGood', function (data) {
        if(dataModal) {
            if (dataModal._id === data._id && $('.modal-importgood').hasClass('in')) {
                $uibModalInstance.dismiss('cancel');
                mvNotifier.error('Đợt nhập hàng này đã được xóa!');
            }
        }
    });
});

angular.module('app').controller('ModalImportGoodConfirmCtrl', function ($scope, $uibModalInstance, mvImportGoodCUD,mvImportDetailCUD, mvNotifier, dataModal, socketio) {
    $scope.modalTitle = "Bạn thật sử muốn xóa!";
    $scope.modalContent = dataModal;
    $scope.modalButton = "Xóa";
    $scope.submitModal = function () {
        mvImportGoodCUD.deleteData(dataModal).then(function () {
        }, function (reason) {
            mvNotifier.error(reason);
        });
        mvImportDetailCUD.deleteData(dataModal).then(function () {
        }, function (reason) {
            mvNotifier.error(reason);
        });
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    socketio.on('deleteImportGood', function (data) {
        if(dataModal._id) {
            if (dataModal._id === data._id && $('.modal-importgood-confirm').hasClass('in')) {
                $uibModalInstance.dismiss('cancel');
                mvNotifier.notify('Bạn đã xóa đợt nhập hàng này!');
            }
        }
    });
});

angular.module('app').controller('ModalImportGoodDetailCtrl', function ($scope, $uibModalInstance, mvImportDetailCUD, mvImportGoodCUD, mvNotifier, dataModal, titleModal, socketio, ngTableParams) {
    $scope.modalTitle = "Chi tiết hóa đơn nhập: "+titleModal.numberBill;
    $scope.modalContent = dataModal;
    $scope.modalButton = "Thêm mới";
    $scope.hideModal = false;
    $scope.productsSelect = [];
    $scope.products.forEach(function (product) {
        if (product.manufactureId === titleModal.manufactureId) {
            $scope.productsSelect.push(product);
        }
    });
    socketio.on('createImportDetail', function (data) {
        if(data.importGoodsId === dataModal[0].importGoodsId){
            dataModal.push(data);
        }
        return tableSetup(dataModal);
    });
    socketio.on('deleteOneImportDetail', function (data) {
        if(data.importGoodsId === dataModal[0].importGoodsId){
            dataModal.forEach(function (detail) {
                if (detail._id === data._id) {
                    return dataModal.splice(dataModal.indexOf(detail), 1);
                }
            });
        }
        return tableSetup(dataModal);
    });
    tableSetup(dataModal);
    $scope.applyGlobalSearchModal = function(data) {
        $scope.globalSearchTermModal = data.searchTermModal.$modelValue;
        if (data.invertedModal.$viewValue){
            $scope.globalSearchTermModal = "!" + $scope.globalSearchTermModal;
        }
        tableSetup(dataModal);
    };

    $scope.sumTotalCost = function () {
        var total = 0;
        dataModal.forEach(function (product) {
            total += parseInt(product.priceEach * product.quantityImport);
        });
        $scope.modalTotalTitle = total;
        return total;
    };

    $scope.productsImport = [{
        id: 0,
        productId: {selected: $scope.products[0]},
        quantityImport: '',
        priceEach: '',
        totalPrice:''
    }];

    $scope.submitModal = function() {
        $scope.productsImport.forEach(function (product) {
            var newData = {
                importGoodsId: dataModal[0].importGoodsId,
                productId: product.productId.selected._id,
                quantityImport: product.quantityImport,
                priceEach: product.priceEach,
                totalPrice: product.priceEach * product.quantityImport
            };
            mvImportDetailCUD.createData(newData).then(function() {
                mvNotifier.notify('Bạn đã xóa đợt nhập hàng này!');
            }, function (reason) {
                return mvNotifier.error(reason);
            })
        });
        var newData = {
            manufactureId: titleModal.manufactureId,
            dayImport: titleModal.dayImport,
            numberBill: titleModal.numberBill,
            totalCost: $scope.modalTotalTitle,
            note: titleModal.note,
            userId: titleModal.userId
        };
        mvImportGoodCUD.updateCurrentData(titleModal, newData).then(function () {
            $scope.productsImport = [{
                id: 0,
                productId: {selected: $scope.products[0]},
                quantityImport: '',
                priceEach: '',
                totalPrice:''
            }];
        }, function (reason) {
            return mvNotifier.error(reason);
        })
    };

    $scope.addNewProduct = function () {
        $scope.productsImport.push({
            id: $scope.productsImport.length,
            productId: {selected: $scope.products[0]},
            quantityImport: '',
            priceEach: '',
            totalPrice:''
        });
    };
    $scope.removeNewProduct = function (data) {
        $scope.productsImport.forEach(function (currentData) {
            if (currentData.id === data.id) {
                $scope.productsImport.splice($scope.productsImport.indexOf(currentData), 1);
            }
        });
    };
    $scope.deleteModel = function(data) {
        mvImportDetailCUD.deleteData(data).then(function () {
            mvNotifier.notify('Bạn đã xóa một sản phẩm nhập!');
        }, function (reason) {
            mvNotifier.error(reason);
        });
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    socketio.on('deleteImportGood', function (data) {
        if(dataModal[0].importGoodsId) {
            if (dataModal[0].importGoodsId === data._id && $('.modal-importgood-detail').hasClass('in')) {
                $uibModalInstance.dismiss('cancel');
                mvNotifier.notify('Bạn đã xóa đợt nhập hàng này!');
            }
            return dataModal = null;
        }
    });
    function tableSetup(dataTable) {
        var page = $scope.dataTableModal && $scope.dataTableModal.page() > 1 ? $scope.dataTableModal.page() : 1,
            filerNow = $scope.globalSearchTermModal ? $scope.globalSearchTermModal : '',
            sorting = $scope.dataTableModal && $scope.dataTableModal.sorting() !== {dateCreate: "desc"} ? $scope.dataTableModal.sorting() : {dateCreate: "desc"},
            count = $scope.dataTableModal && $scope.dataTableModal.count() !== 5 ? $scope.dataTableModal.count() : 5,
            group = $scope.dataTableModal && $scope.dataTableModal.group() !== {_id: "desc"} ? $scope.dataTableModal.group() : {_id: "desc"};
        $scope.dataTableModal = new ngTableParams({
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