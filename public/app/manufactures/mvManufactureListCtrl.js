angular.module("app").controller("mvManufactureListCtrl", function ($scope, mvManufacture, mvIdentity, $uibModal, socketio, ngTableParams) {
    var manufacture;
    mvManufacture.query().$promise.then(function(result) {
        manufacture = result.data;
        return tableSetup(manufacture);
    });
    $scope.identity = mvIdentity;

    $scope.applyGlobalSearch = function(data) {
        $scope.globalSearchTerm = data.searchTerm.$modelValue;
        if (data.inverted.$viewValue){
            $scope.globalSearchTerm = "!" + $scope.globalSearchTerm;
        }
        return tableSetup(manufacture);
    };

    $scope.openModel = function (data) {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'myModalContent',
            controller: 'ModalManufactureCtrl',
            scope: $scope,
            size: "lg",
            windowClass: "modal-manufacture",
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
            controller: 'ModalManufactureConfirmCtrl',
            scope: $scope,
            size: "md",
            windowClass: "modal-manufacture-confirm",
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

    socketio.on('createManufacture', function (data) {
        manufacture.push(data);
        tableSetup(manufacture)
    });

    socketio.on('updateManufacture',function(data) {
        manufacture.forEach(function (currentData) {
            if (currentData._id === data._id) {
                return angular.extend(currentData, data);
            }
        });
        tableSetup(manufacture)
    });

    socketio.on('deleteManufacture', function (data) {
        manufacture.forEach(function (currentData) {
            if (currentData._id === data._id) {
                return manufacture.splice(manufacture.indexOf(currentData), 1);
            }
        });
        tableSetup(manufacture)
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

angular.module('app').controller('ModalManufactureCtrl', function ($scope, $uibModalInstance, mvManufactureCUD, mvNotifier, dataModal, socketio) {
    $scope.banks = [];
    if(dataModal){
        $scope.modalTitle = "Chỉnh sửa nhà cung cấp";
        $scope.modalButton = "Chỉnh sửa";

        $scope.name = dataModal.name;
        $scope.address = dataModal.address;
        $scope.taxCode = dataModal.taxCode;
        $scope.contactPerson = dataModal.contactPerson;
        $scope.telephone = dataModal.telephone;
        for(var i = 0,j = dataModal.banks.length; i< j;i++) {
            $scope.banks.push(dataModal.banks[i]);
        }

        $scope.submitModal = function() {
            var newData = {
                name: $scope.name,
                address: $scope.address,
                taxCode: $scope.taxCode,
                contactPerson: $scope.contactPerson,
                telephone: $scope.telephone,
                banks: $scope.banks
            };
            mvManufactureCUD.updateCurrentData(dataModal, newData).then(function () {
            }, function (reason) {
                return mvNotifier.error(reason);
            })
        };
    }else {
        $scope.modalTitle = "Tạo nhà cung cấp mới";
        $scope.modalButton = "Tạo mới";
        $scope.banks = [{
            id: $scope.banks.length,
            nameBank: '',
            idBank: ''
        }];
        $scope.submitModal = function () {
            var newData = {
                name: $scope.name,
                address: $scope.address,
                taxCode: $scope.taxCode,
                contactPerson: $scope.contactPerson,
                telephone: $scope.telephone,
                banks: $scope.banks
            };
            mvManufactureCUD.createData(newData).then(function () {
                mvNotifier.notify('Bạn đã tạo một Nhà cung cấp!');
                $scope.manufactureForm.$setUntouched();
                $scope.name = '';
                $scope.address = '';
                $scope.taxCode = '';
                $scope.contactPerson = '';
                $scope.telephone = '';
                $scope.banks = [{
                    id:$scope.banks.length,
                    nameBank: '',
                    idBank: ''
                }];
            }, function (reason) {
                return mvNotifier.error(reason);
            })
        };
    }
    $scope.addNewBank = function () {
        $scope.banks.push({
            id:$scope.banks.length,
            nameBank: '',
            idBank: ''
        });
    };
    $scope.removeNewBank = function (data) {
        $scope.banks.forEach(function (currentData) {
            if (currentData.id === data.id) {
                $scope.banks.splice($scope.banks.indexOf(currentData), 1);
            }
        });
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    socketio.on('updateManufacture',function(data) {
        if(dataModal) {
            if (dataModal._id === data._id && $('.modal-manufacture').hasClass('in')) {
                $uibModalInstance.dismiss('cancel');
                mvNotifier.notify('Nhà cung cấp đã được chỉnh sửa!');
            }
        }
    });
    socketio.on('deleteManufacture', function (data) {
        if(dataModal) {
            if (dataModal._id === data._id && $('.modal-manufacture').hasClass('in')) {
                $uibModalInstance.dismiss('cancel');
                mvNotifier.error('Nhà cung cấp đã được xóa!');
            }
        }
    });
});

angular.module('app').controller('ModalManufactureConfirmCtrl', function ($scope, $uibModalInstance, mvManufactureCUD, mvNotifier, dataModal, socketio) {
    $scope.modalTitle = "Bạn thật sử muốn xóa!";
    $scope.modalContent = "Nhà cung cấp: <strong>"+dataModal.name+"</strong> ở địa chỉ: <strong>"+dataModal.address +"</strong>, mã số thuế là: <strong>"+dataModal.taxCode+"</strong>";
    $scope.modalButton = "Xóa";
    $scope.submitModal = function () {
        mvManufactureCUD.deleteData(dataModal).then(function () {
        }, function (reason) {
            mvNotifier.error(reason);
        })
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    socketio.on('deleteManufacture', function (data) {
        if(dataModal._id) {
            if (dataModal._id === data._id && $('.modal-manufacture-confirm').hasClass('in')) {
                $uibModalInstance.dismiss('cancel');
                mvNotifier.notify('Bạn đã xóa một Nhà cung cấp!');
            }
        }
    });
});