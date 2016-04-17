angular.module('ShopCtrl', []).controller('ShopController', function($scope, $http, Voucher, Product, Base64) {
    $scope.formData = {};
    $scope.products = {};
    $scope.cart = [];
    var cartCounter = 0;
    $scope.discounts = [];
    $scope.total = 0;
    $scope.successMsg = '';
    $scope.success = false;
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

    function clearCart () {
      $scope.cart = [];
      cartCounter = 0;
      $scope.discounts = [];
      $scope.total = 0;
    };

    function showSuccessMsg () {
      $scope.successMsg = 'Thank you for buying our products!';
      $scope.success = true;
    };

    $scope.addToCart = function (name, price) {
      $scope.cart.push({
        name: name,
        price: price,
        id: cartCounter
      });
      cartCounter++;
      $scope.total += price;
      $scope.success = false;
    };

    $scope.removeFromCart = function (id) {
      var itemToRemove = $scope.cart.filter(function (item) { return item.id === id; })[0];
      $scope.cart.splice($scope.cart.indexOf(itemToRemove), 1);
      $scope.total -= itemToRemove.price;
    };

    $scope.submitVoucher = function () {
      //console.log($scope.formData);
      if ($scope.cart.length) {
        // add dummy voucher for now without checking
        $scope.discounts.push({
          value: 10,
          type: 'EUR'
        });

        $scope.total -= 10;
        // TO DO:
        // verify voucher
        // if valid - check type & apply to cart (add to discounts and calculate total price)
      }
    };

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

    $scope.buyProducts = function () {
      // TO DO
      // consume voucher

      // clear products from cart
      clearCart();
      // display success message
      showSuccessMsg();
    };
});