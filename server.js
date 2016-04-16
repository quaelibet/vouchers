// node modules
var express        = require('express');
var app            = express();
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var mongoose       = require('mongoose');

var port = process.env.PORT || 3000;
// db config file
var db = require('./config/db');
// connect to db
mongoose.connect(db.url);

app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(express.static(__dirname + '/public')); // static files location

// routing
require('./app/routes')(app);

// start app
app.listen(port);
console.log('App running on http://localhost:' + port);

exports = module.exports = app;