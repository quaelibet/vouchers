angular.module('CampaignCtrl', []).controller('CampaignController', function($scope, $http, Voucher, Campaign, Base64) {

    $scope.formData = {};
    var username = 'admin';
    var password = 'admin';

    var encoded = Base64.encode(username + ':' + password);
    $http.defaults.headers.common.Authorization = 'Basic ' + encoded;


});