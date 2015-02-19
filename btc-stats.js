var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var bitminter = require('bitminter');
var fs = require('fs');
var app = express();
var router = express.Router();
var port = process.env.PORT;
var username = process.env.USER;
bitminter.apikey = process.env.API_KEY;
var logfile = process.env.LOGFILE;

var checkEnv = function (names) {
	names.forEach(function (name) {
		if (process.env[name] === undefined) {
			console.log('Missing environment variable: ' + name);
			process.exit();
		}
	});
};

checkEnv(['LOGFILE', 'USER', 'API_KEY', 'PORT']);


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
	bitminter.get('pool/blocks', {max: 5, commodity: 'BTC'}, function (err, stats) {
		res.json(err || stats);
	});
}

function getPoolBlocksNMCJson(req, res) {
	bitminter.get('pool/blocks', {max: 5, commodity: 'NMC'}, function (err, stats) {
		res.json(err || stats);
	});
}

function getLastRestart(req, res) {
	fs.readFile(logfile, 'utf-8', function (err, data) {
		if (err) {
			console.log(err);
			throw err;
		}

		var lines = data.trim().split('\n');
		var last = lines.slice(-1)[0];
		var date = last.split('at: ')[1];
		res.json({
			lastRestart: date
		})
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
router.get('/api/lastrestart', getLastRestart);

app.listen(port);
console.log('Listening on port ' + port);
console.log('username ' + username);
console.log('apikey ' + bitminter.apikey);
console.log('logfile ' + logfile);
