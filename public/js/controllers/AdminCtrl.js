angular.module('AdminCtrl', []).controller('AdminController', function($scope, $http, Voucher, Campaign, Base64) {

    $scope.formData = {};
    $scope.campaignData = {
      active : true,
      eternal : true
    };
    $scope.c_success = false;
    $scope.c_failure = false;
    $scope.c_successMsg = "";
    $scope.c_failureMsg = "";

    $scope.voucherData = {
      selectedCampaign : '- new -',
      campaign_prefix : '',
      discount_type : "Const",
      discount : 0,
      no_uses : 1,
      no_vouchers : 1
    };
    $scope.v_success = false;
    $scope.v_failure = false;
    $scope.v_successMsg = "";
    $scope.v_failureMsg = "";
    $scope.newCampaign = true;

    $scope.campaigns = [
      { prefix : '- new -' }
    ];
    var username = 'admin';
    var password = 'admin';

    var encoded = Base64.encode(username + ':' + password);
    $http.defaults.headers.common.Authorization = 'Basic ' + encoded;

    (function getCampaigns () {
      Campaign.getCampaigns()
      .then(function (resp) {
        if (resp.data.length) {
          for (var i = 0; i < resp.data.length; i++) {
            $scope.campaigns.push(resp.data[i]);
          }
        }
      }, function (err) {
        console.log(err.message);
      });
    })();

    $scope.checkIfNewCampaign = function (campaign) {
      if (campaign === '- new -') {
        $scope.newCampaign = true;
      } else {
        $scope.newCampaign = false;
      }
    };

    function clearMessages () {
      $scope.c_success = false;
      $scope.c_failure = false;
      $scope.c_successMsg = "";
      $scope.c_failureMsg = "";
      $scope.v_success = false;
      $scope.v_failure = false;
      $scope.v_successMsg = "";
      $scope.v_failureMsg = "";
    };

    function clearCampaignFormData () {
      $scope.campaignData = {
        active : true,
        eternal : true,
        prefix : '',
        end_date: null
      };
    };

    $scope.createCampaign = function () {
      clearMessages();
      // check if prefix filled
      if (!$scope.campaignData.prefix || !$scope.campaignData.prefix.length) {
        $scope.c_failureMsg = "Campaign not created. You need to submit prefix for campaign!"
        $scope.c_failure = true;
      } else {
        // create campaign
        Campaign.createCampaign($scope.campaignData)
        .then(function (resp) {
          $scope.campaigns.push(resp.data);
          $scope.c_successMsg = "Campaign created";
          $scope.c_success = true;
          // clear form data
          clearCampaignFormData();
        }, function (err) {
          console.log(err.message);
        });
      }
    };

    function clearVoucherFormData () {
      $scope.voucherData = {
        selectedCampaign : '- new -',
        campaign_prefix : '',
        discount_type : "Const",
        discount : 0,
        no_uses : 1,
        no_vouchers : 1
      };
      $scope.newCampaign = true;
    };

    $scope.createVouchers = function () {
      clearMessages();
      // if new campaign - check if prefix filled
      if ($scope.voucherData.selectedCampaign === '- new -') {
        if (!$scope.voucherData.campaign_prefix || !$scope.voucherData.campaign_prefix.length) {
          $scope.v_failureMsg = "Voucher not created. You need to submit prefix for new campaign!"
          $scope.v_failure = true;
          return;
        }
      } else {
        // set campaign prefix
        $scope.voucherData.campaign_prefix = $scope.voucherData.selectedCampaign;
      }
      // check if number of vouchers to create filled
      if (($scope.voucherData.discount === null) || ($scope.voucherData.discount === undefined)) {
        $scope.voucherData.discount = 0;
      }
      if (!$scope.voucherData.no_uses) {
        $scope.voucherData.no_uses = 1;
      }
      if (!$scope.voucherData.no_vouchers) {
        $scope.voucherData.no_vouchers = 1;
      }

      var vouchers = [];
      for (var i = 0; i < $scope.voucherData.no_vouchers; i++) {
        vouchers.push($scope.voucherData);
      }
      Voucher.createVouchers(vouchers)
      .then(function (resp) {
          $scope.v_successMsg = "Vouchers created";
          $scope.v_success = true;
          // clear form data
          clearVoucherFormData();
        }, function (err) {
          console.log(err.message);
        });
    };
});