angular.module('ShopCtrl', []).controller('ShopController', function($scope, $http, Voucher, Product, Base64) {

    $scope.formData = {};
    $scope.products = {};
    var username = 'user';
    var password = 'passwd';

    var encoded = Base64.encode(username + ':' + password);
    $http.defaults.headers.common.Authorization = 'Basic ' + encoded;

    // dummy 3 products creation
    (function initProducts () {
      Product.get()
      .then(function (resp) {
        if (!resp.data || !resp.data.length) {
          Product.create()
          .then(function (resp) {
            $scope.products = resp.data;
          }, function (err) {
            console.log(err.message);
          });
        } else {
          $scope.products = resp.data;
        }
      }, function (err) {
        console.log(err.message);
      });
    })();


    function getVouchers() {
      Voucher.get()
      .then(function (resp) {
        $scope.vouchers = resp.data;
      }, function (err) {
        console.log(err.message);
      });
    };

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