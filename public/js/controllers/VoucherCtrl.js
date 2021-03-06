angular.module('VoucherCtrl', []).controller('VoucherController', function($scope, $http, Voucher, Base64) {

    $scope.formData = {};
    var username = 'user';
    var password = 'passwd';

    var encoded = Base64.encode(username + ':' + password);
    $http.defaults.headers.common.Authorization = 'Basic ' + encoded;

    function getVouchers() {
      Voucher.get()
      .then(function (resp) {
        $scope.vouchers = resp.data;
      }, function (err) {
        console.log(err.message);
      });
    };

    // delete a todo after checking it
    $scope.deleteVoucher = function(id) {
      Voucher.delete(id)
      .then(function (resp) {
        $scope.vouchers = resp.data;
      }, function (err) {
        console.log(err.message);
      });
    };

    $scope.consumeVoucher = function () {};
});