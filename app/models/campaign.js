var mongoose = require('mongoose');

module.exports = mongoose.model('Campaign', {
    prefix : {
      type    : String,
      default : ''
    },
    active : {
      type    : Boolean,
      default : true
    },
    eternal : {
      type    : Boolean,
      default : true
    },
    end_date : {
      type    : Date
    }
});