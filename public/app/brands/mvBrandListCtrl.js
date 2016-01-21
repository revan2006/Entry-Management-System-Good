angular.module("app").controller("mvBrandListCtrl", function ($scope, mvBrand, mvIdentity, $uibModal, socketio, ngTableParams) {
    var brand;
    mvBrand.query().$promise.then(function(result) {
        brand = result.data;
        return tableSetup(brand);
    });
    $scope.identity = mvIdentity;

    $scope.applyGlobalSearch = function(data) {
        $scope.globalSearchTerm = data.searchTerm.$modelValue;
        if (data.inverted.$viewValue){
            $scope.globalSearchTerm = "!" + $scope.globalSearchTerm;
        }
        return tableSetup(brand);
    };

    $scope.openModel = function (data) {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'myModalContent',
            controller: 'ModalBrandCtrl',
            scope: $scope,
            size: "lg",
            windowClass: "modal-brand",
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
            controller: 'ModalBrandConfirmCtrl',
            scope: $scope,
            size: "md",
            windowClass: "modal-brand-confirm",
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

    socketio.on('createBrand', function (data) {
        brand.push(data);
        tableSetup(brand)
    });

    socketio.on('updateBrand',function(data) {
        brand.forEach(function (currentData) {
            if (currentData._id === data._id) {
                return angular.extend(currentData, data);
            }
        });
        tableSetup(brand)
    });

    socketio.on('deleteBrand', function (data) {
        brand.forEach(function (currentData) {
            if (currentData._id === data._id) {
                return brand.splice(brand.indexOf(currentData), 1);
            }
        });
        tableSetup(brand)
    });

    function tableSetup(dataTable) {
        var page = $scope.dataTable && $scope.dataTable.page() > 1 ? $scope.dataTable.page() : 1,
            filerNow = $scope.globalSearchTerm ? $scope.globalSearchTerm : '',
            sorting = $scope.dataTable && $scope.dataTable.sorting() !== {dateCreate: "desc"} ? $scope.dataTable.sorting() : {dateCreate: "desc"},
            count = $scope.dataTable && $scope.dataTable.count() !== 5 ? $scope.dataTable.count() : 5,
            group = $scope.dataTable && $scope.dataTable.group() !== {$: "asc"} ? $scope.dataTable.group() : {$: "asc"};
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

angular.module('app').controller('ModalBrandCtrl', function ($scope, $uibModalInstance, mvBrandCUD, mvNotifier, dataModal, socketio) {
    if(dataModal){
        $scope.modalTitle = "Chỉnh sửa thương hiệu";
        $scope.modalButton = "Chỉnh sửa";

        $scope.name = dataModal.name;
        $scope.note = dataModal.note;

        $scope.submitModal = function() {
            var newData = {
                name: $scope.name,
                note: $scope.note
            };
            mvBrandCUD.updateCurrentData(dataModal, newData).then(function () {
            }, function (reason) {
                return mvNotifier.error(reason);
            })
        };
    }else {
        $scope.modalTitle = "Tạo thương hiệu mới";
        $scope.modalButton = "Tạo mới";
        $scope.submitModal = function () {
            var newData = {
                name: $scope.name,
                note: $scope.note
            };
            mvBrandCUD.createData(newData).then(function () {
                mvNotifier.notify('Bạn đã tạo một thương hiệu!');
                $scope.brandForm.$setUntouched();
                $scope.name = '';
                $scope.note = '';
            }, function (reason) {
                return mvNotifier.error(reason);
            })
        };
    }
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    socketio.on('updateBrand',function(data) {
        if(dataModal) {
            if (dataModal._id === data._id && $('.modal-brand').hasClass('in')) {
                $uibModalInstance.dismiss('cancel');
                mvNotifier.notify('Thương hiệu đã được chỉnh sửa!');
            }
        }
    });
    socketio.on('deleteBrand', function (data) {
        if(dataModal) {
            if (dataModal._id === data._id && $('.modal-brand').hasClass('in')) {
                $uibModalInstance.dismiss('cancel');
                mvNotifier.error('Thương hiệu đã được xóa!');
            }
        }
    });
});

angular.module('app').controller('ModalBrandConfirmCtrl', function ($scope, $uibModalInstance, mvBrandCUD, mvNotifier, dataModal, socketio) {
    $scope.modalTitle = "Bạn thật sử muốn xóa!";
    $scope.modalContent = "Thương hiệu: <strong>"+dataModal.name+"</strong> "+dataModal.note;
    $scope.modalButton = "Xóa";
    $scope.submitModal = function () {
        mvBrandCUD.deleteData(dataModal).then(function () {
        }, function (reason) {
            mvNotifier.error(reason);
        })
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    socketio.on('deleteBrand', function (data) {
        if(dataModal._id) {
            if (dataModal._id === data._id && $('.modal-brand-confirm').hasClass('in')) {
                $uibModalInstance.dismiss('cancel');
                mvNotifier.notify('Bạn đã xóa một thương hiệu!');
            }
        }
    });
});