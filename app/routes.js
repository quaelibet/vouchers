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

// dummy 3 products creation
(function initProducts () {
  var products = Product.find(function (err, products) {
    if (err) {
      return;
    }
    if (!products || !products.length) {
      Product.create({
        name : 'Product 1',
        price : 100,
        desc : 'Product 1 description',
        img : 'saddle1.jpg'
      });
      Product.create({
        name : 'Product 2',
        price : 150,
        desc : 'Product 2 description',
        img : 'saddle2.jpg'
      });
      Product.create({
        name : 'Product 3',
        price : 300,
        desc : 'Product 3 description'
      });
    }
  });
})();

module.exports = function(app) {
  // front-end routes
  app.get('*', function(req, res) {
      res.sendFile('index.html', { root : __dirname + '/../public/views' }); // load our public/index.html file
  });

  // API routes
  // get campaigns
  app.get('/api/campaigns', auth, function (req, res) {
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
      end_date : Date(req.body.end_date)  //'yyyy-mm-dd'
    }, function (err, campaign) {
      if (err) {
        res.send(err);
      }
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
    Voucher.create({
      voucher_id : req.body.campaign_prefix + "_" + shortid.generate(),
      campaign_prefix : req.body.campaign_prefix,
      discount : req.body.discount,
      discount_type : req.body.discount_type || "Percent",
      no_uses : req.body.no_uses || 1
    }, function (err, voucher) {
      if (err) {
        res.send(err);
      }
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
}