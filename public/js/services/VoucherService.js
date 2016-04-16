angular.module('VoucherService', []).factory('Voucher', ['$http', function ($http) {

    return {
        getVouchers : function() {
            return $http.get('/api/vouchers');
        },

        getVoucher : function (voucher_id) {
            return $http.get('/api/vouchers/' + voucher_id);
        },

        createVoucher : function (voucherData) {
            return $http.post('/api/vouchers', voucherData);
        },

        deleteVoucher : function (voucher_id) {
            return $http.delete('/api/vouchers/' + voucher_id);
        }
    }

}]);