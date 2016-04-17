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

    $scope.newCampaign = true;
    $scope.selectedCampaign = '- new -';
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
          $scope.campaignData = {
            active : true,
            eternal : true,
            prefix : '',
            end_date: null
          };
        }, function (err) {
          console.log(err.message);
        });
      }
    };
});