angular.module('CampaignService', []).factory('Campaign', ['$http', function ($http) {

    return {
        getCampaigns : function() {
            return $http.get('/api/campaigns');
        },

        getCampaign : function (prefix) {
            return $http.get('/api/campaigns/' + prefix);
        },

        createCampaign : function (campaignData) {
            return $http.post('/api/campaigns', campaignData);
        }
    }

}]);