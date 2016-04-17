angular.module('AdminCtrl', []).controller('AdminController', function($scope, $http, Voucher, Campaign, Base64) {

    $scope.formData = {};
    $scope.newCampaign = true;
    $scope.selectedCampaign = '- new -';
    $scope.campaigns = [
      { prefix : '- new -' },
      { prefix : 'AAABBBCCC' }
    ];
    var username = 'admin';
    var password = 'admin';

    var encoded = Base64.encode(username + ':' + password);
    $http.defaults.headers.common.Authorization = 'Basic ' + encoded;

    $scope.checkIfNewCampaign = function (campaign) {
      if (campaign === '- new -') {
        $scope.newCampaign = true;
      } else {
        $scope.newCampaign = false;
      }
    };
});