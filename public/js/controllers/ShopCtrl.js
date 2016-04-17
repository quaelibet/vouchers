angular.module('ShopCtrl', []).controller('ShopController', function($scope, $http, Voucher, Product, Campaign, Base64) {
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
    $scope.voucherError = false;
    $scope.voucherErrorMsg = '';

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

    function showVoucherError (msg) {
      $scope.voucherError = true;
      $scope.voucherErrorMsg = msg;
    };

    function clearVoucherCode () {
      $scope.formData.voucher = '';
    };

    function recalculateCart () {
      if (!$scope.cart.length) {
        $scope.total = 0;
        cartCounter = 0;
        $scope.discounts = [];
      } else {
        var total = 0;
        $scope.cart.forEach(function (item) {
          total += item.price;
        });
        $scope.discounts.forEach(function (discount) {
          switch (discount.type) {
            case "Percent" :
              total -= (total * discount.value / 100);
              break;
            case "Const" :
              total -= discount.value;
              break;
          }
        });
        $scope.total = total;
      }
    };

    $scope.addToCart = function (name, price) {
      $scope.cart.push({
        name: name,
        price: price,
        id: cartCounter
      });
      cartCounter++;
      recalculateCart();
      $scope.success = false;
    };

    $scope.removeFromCart = function (id) {
      var itemToRemove = $scope.cart.filter(function (item) { return item.id === id; })[0];
      $scope.cart.splice($scope.cart.indexOf(itemToRemove), 1);
      recalculateCart();
    };

    function applyVoucherToCart (voucher) {
      // check discount type
      var discountType = voucher.discount_type;
      switch (voucher.discount_type) {
        case "Percent" :
          $scope.discounts.push({
            value: voucher.discount,
            type: "Percent",
            sufix: '%',
            voucher_id: voucher.voucher_id,
            no_uses: voucher.no_uses
          });
          $scope.total -= ($scope.total * voucher.discount / 100);
          break;
        case "Const":
        default:
          $scope.discounts.push({
            value: voucher.discount,
            type: "Const",
            sufix: 'EUR',
            voucher_id: voucher.voucher_id,
            no_uses: voucher.no_uses
          });
          $scope.total -= voucher.discount;
          break;
      }
    };

    function compareDates (date1, date2) {
      date1.setHours(0,0,0,0);
      date2.setHours(0,0,0,0);

      return date1.getTime() >= date2.getTime();
    };

    function validateVoucher (id) {
      Voucher.getVoucher(id)
      .then(function (resp) {
        if (!resp.data.length) {
          showVoucherError('Voucher doesn\'t exist');
          clearVoucherCode();
          return;
        }
        var voucher = resp.data[0];
        // check number of uses
        if (voucher.no_uses < 1) {
          showVoucherError('Voucher already used allowed number of times');
          clearVoucherCode();
          return;
        }
        // find campaign for that voucher
        Campaign.getCampaign(voucher.campaign_prefix)
        .then(function (resp) {
          if (!resp.data.length) {
            showVoucherError('Invalid voucher');
            clearVoucherCode();
            return;
          }
          // check if campaign is active
          var campaign = resp.data[0];
          if (!campaign.active) {
            showVoucherError('Invalid voucher');
            clearVoucherCode();
            return;
          }
          // check if campaign is eternal
          if (campaign.eternal) {
            applyVoucherToCart(voucher);
            return;
          }
          // check campaign end date
          if (!campaign.end_date) { // campaign isn't eternal but doesn't have any end date
            showVoucherError('Invalid voucher');
            clearVoucherCode();
            return;
          }
          if (!compareDates(new Date(campaign.end_date), new Date())) {
            showVoucherError('Invalid voucher');
            clearVoucherCode();
            return;
          }
          applyVoucherToCart(voucher);

        }, function (err) {
          console.log(err.message);
        });
      }, function (err) {
        console.log(err.message);
      });
    };

    $scope.submitVoucher = function () {
      if (!$scope.formData.voucher || !$scope.formData.voucher.length) {
        showVoucherError('You have to submit voucher code to add it to cart');
        clearVoucherCode();
        return;
      }
      if ($scope.cart.length) {
        // check if that voucher isn't already added to cart
        var voucherInCart = $scope.discounts.filter(function (item) {
          return item.voucher_id === $scope.formData.voucher;
        });
        if (voucherInCart.length) {
          showVoucherError('You can\'t add the same voucher to cart twice');
          clearVoucherCode();
          return;
        }
        // if valid - apply to cart
        validateVoucher($scope.formData.voucher);
        clearVoucherCode();
      } else {
        showVoucherError('You can\'t add vouchers to an empty cart');
        clearVoucherCode();
      }
    };

    function consumeVoucher (voucher) {
      // reduce voucher no_uses
      Voucher.consumeVoucher(voucher.voucher_id, voucher.no_uses - 1)
      .then(function (resp) {
        voucher.no_uses--;
      }, function (err) {
        console.log(err.message);
      });
    };

    function consumeVouchers () {
      $scope.discounts.forEach(function (voucher) {
        consumeVoucher(voucher);
      });
    };

    $scope.buyProducts = function () {
      // do anything only if cart is not empty
      if (!$scope.cart.length) {
        return;
      }
      // consume vouchers
      consumeVouchers();
      // clear products from cart
      clearCart();
      // display success message
      showSuccessMsg();
    };
});