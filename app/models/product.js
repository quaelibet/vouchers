var mongoose = require('mongoose');

module.exports = mongoose.model('Product', {
    name : {
      type    : String,
      default : ''
    },
    price : {
      type    : Number,
      default : 0
    },
    desc : {
      type    : String,
      default : ''
    },
    img : {
      type    : String,
      default : 'no_photo.jpg'
    }
});