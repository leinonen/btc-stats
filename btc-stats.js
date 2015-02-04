var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var bitminter = require('bitminter');
var app = express();
var router = express.Router();
var port = process.env.PORT || 4000;
var username = process.env.USER;
bitminter.apikey = process.env.API_KEY;

// ----------

function getUserJson(req, res) {
	bitminter.get('users/' + username, function (err, user) {
		res.json(err || user);
	});
}

function getPoolStatsJson(req, res) {
	bitminter.get('pool/stats', function (err, stats) {
		res.json(err || stats);
	});
}

function getPoolShiftsJson(req, res) {
	bitminter.get('pool/shifts', {max: 5}, function (err, stats) {
		res.json(err || stats);
	});
}

function getPoolBlocksBTCJson(req, res) {
	bitminter.get('pool/blocks', {max: 5, commodity:'BTC'}, function (err, stats) {
		res.json(err || stats);
	});
}

function getPoolBlocksNMCJson(req, res) {
	bitminter.get('pool/blocks', {max: 5, commodity:'NMC'}, function (err, stats) {
		res.json(err || stats);
	});
}

function notFoundHandler(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
}

function errorHandler(err, req, res, next) {
	res.sendStatus(err.status || 500).end();
}

// ----------

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(router);
app.use(notFoundHandler);
app.use(errorHandler);

router.get('/api/user', getUserJson);
router.get('/api/pool/stats', getPoolStatsJson);
router.get('/api/pool/shifts', getPoolShiftsJson);
router.get('/api/pool/blocks/btc', getPoolBlocksBTCJson);
router.get('/api/pool/blocks/nmc', getPoolBlocksNMCJson);

app.listen(port);
console.log('Listening on port ' + port);