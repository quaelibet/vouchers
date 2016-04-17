var basicAuth = require('basic-auth');
var shortid = require('shortid');

var Campaign = require('./models/campaign');
var Voucher = require('./models/voucher');
var Product = require('./models/product');

var auth = function (req, res, next) {
  function unauthorized(res) {
    res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
    return res.send(401);
  };

  var user = basicAuth(req);

  if (!user || !user.name || !user.pass) {
    return unauthorized(res);
  };

  if (user.name === 'user' && user.pass === 'passwd') {
    return next();
  } else {
    return unauthorized(res);
  };
};

var adminAuth = function (req, res, next) {
  function unauthorized(res) {
    res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
    return res.send(401);
  };

  var user = basicAuth(req);

  if (!user || !user.name || !user.pass) {
    return unauthorized(res);
  };

  if (user.name === 'admin' && user.pass === 'admin') {
    return next();
  } else {
    return unauthorized(res);
  };
};

var bothAuth = function (req, res, next) {
  function unauthorized(res) {
    res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
    return res.send(401);
  };

  var user = basicAuth(req);

  if (!user || !user.name || !user.pass) {
    return unauthorized(res);
  };

  if ((user.name === 'admin' && user.pass === 'admin') || (user.name === 'user' && user.pass === 'passwd')) {
    return next();
  } else {
    return unauthorized(res);
  };
};

// // dummy 3 products creation
// (function initProducts () {
//   var products = Product.find(function (err, products) {
//     if (err) {
//       return;
//     }
//     if (!products || !products.length) {
//       Product.create({
//         name : 'Product 1',
//         price : 100,
//         desc : 'Product 1 description',
//         img : 'saddle1.jpg'
//       });
//       Product.create({
//         name : 'Product 2',
//         price : 150,
//         desc : 'Product 2 description',
//         img : 'saddle2.jpg'
//       });
//       Product.create({
//         name : 'Product 3',
//         price : 300,
//         desc : 'Product 3 description'
//       });
//     }
//   });
// })();

module.exports = function(app) {


  // API routes
  // get products
  app.get('/api/products', auth, function (req, res) {
    Product.find(function (err, products) {
      if (err) {
        res.send(err);
      }

      res.json(products);
    });
  });
  // create products
  app.post('/api/products', auth, function (req, res) {
    Product.create({
      name : 'Product 1',
      price : 100,
      desc : 'Product 1 description',
      img : 'saddle1.jpg'
    }, {
      name : 'Product 2',
      price : 150,
      desc : 'Product 2 description',
      img : 'saddle2.jpg'
    }, {
      name : 'Product 3',
      price : 300,
      desc : 'Product 3 description'
    }, function (err) {
      if (err) {
        res.send(err);
      }
      Product.find(function (err, products) {
        if (err) {
          res.send(err);
        }
        res.json(products);
      });
    });
  });

  // get campaigns
  app.get('/api/campaigns', bothAuth, function (req, res) {
    Campaign.find(function (err, campaigns) {
      if (err) {
        res.send(err);
      }

      res.json(campaigns);
    });
  });
  // get campaign by prefix
  app.get('/api/campaigns/:campaign_prefix', auth, function (req, res) {
    Campaign.find({
      prefix : req.params.campaign_prefix
    },function (err, campaign) {
      if (err) {
        res.send(err);
      }

      res.json(campaign);
    });
  });
  // create campaign
  app.post('/api/campaigns', adminAuth, function (req, res) {
    Campaign.create({
      prefix : req.body.prefix,
      active : req.body.active,
      eternal : req.body.eternal,
      end_date : req.body.end_date
    }, function (err, campaign) {
      if (err) {
        res.send(err);
      }

      res.json(campaign);
    });
  });

  // get vouchers
  app.get('/api/vouchers', auth, function (req, res) {
    Voucher.find(function (err, vouchers) {
      if (err) {
        res.send(err);
      }

      res.json(vouchers);
    });
  });
  // get voucher by voucher_id
  app.get('/api/vouchers/:voucher_id', auth, function (req, res) {
    Voucher.find({
      voucher_id : req.params.voucher_id
    },function (err, voucher) {
      if (err) {
        res.send(err);
      }

      res.json(voucher);
    });
  });
  // create voucher
  app.post('/api/vouchers', adminAuth, function (req, res) {
    var vouchersObj = req.body;
    var vouchersToCreate = [];
    for (var i = 0; i < vouchersObj.no_vouchers; i++) {
      vouchersToCreate.push({
        campaign_prefix : vouchersObj.campaign_prefix,
        voucher_id : vouchersObj.campaign_prefix + "_" + shortid.generate(),
        discount_type : vouchersObj.discount_type,
        discount : vouchersObj.discount,
        no_uses : vouchersObj.no_uses
      });
    }

    Voucher.create(vouchersToCreate,
      function (err, voucher) {
        if (err) {
          res.send(err);
        }
        res.json(voucher);
    });
  });
  // delete voucher
  app.delete('/api/vouchers/:voucher_id', adminAuth, function (req, res) {
    Voucher.remove({
        _id : req.params.voucher_id
    }, function (err, voucher) {
        if (err) {
          res.send(err);
        }
        res.send("success");
    });
  });

  // front-end routes
  app.get('*', function(req, res) {
      res.sendFile('index.html', { root : __dirname + '/../public/views' }); // load our public/index.html file
  });
}