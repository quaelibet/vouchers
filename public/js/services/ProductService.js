angular.module('ProductService', []).factory('Product', ['$http', function ($http) {

    return {
        get : function() {
            return $http.get('/api/products');
        },

        create : function () {
            return $http.post('/api/products');
        }
    }

}]);