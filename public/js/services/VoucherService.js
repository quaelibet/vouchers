angular.module('VoucherService', []).factory('Voucher', ['$http', function ($http) {

    return {
        getVouchers : function() {
            return $http.get('/api/vouchers');
        },

        getVoucher : function (voucher_id) {
            return $http.get('/api/vouchers/' + voucher_id);
        },

        createVouchers : function (voucherData) {
            return $http.post('/api/vouchers', angular.toJson(voucherData));
        },

        deleteVoucher : function (voucher_id) {
            return $http.delete('/api/vouchers/' + voucher_id);
        },

        consumeVoucher : function (voucher_id, no_uses) {
            return $http.post('/api/voucher/' + voucher_id, angular.toJson({no_uses : no_uses}));
        }
    }

}]);