angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $routeProvider
        .when('/', {
            templateUrl: 'views/shop.html',
            controller: 'ShopController'
        })
        .when('/admin', {
            templateUrl: 'views/campaigns.html',
            controller: 'CampaignController'
        });

    $locationProvider.html5Mode(true);

}]);