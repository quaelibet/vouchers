var mongoose = require('mongoose');

module.exports = mongoose.model('Voucher', {
    voucher_id : {
      type    : String,
      default : ''
    },
    campaign_prefix : {
      type    : String,
      default : ''
    },
    discount : {
      type    : Number,
      default : 0,
      min     : 0
    },
    discount_type : {
      type    : String,
      default : 'Const'
    },
    no_uses : {
      type    : Number,
      default : 1,
      min     : 1
    }
});