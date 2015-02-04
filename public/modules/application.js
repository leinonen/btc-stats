(function () {

	var app = angular.module('application', []);

	app.controller('StatsCtrl',
		['$http', '$interval', function ($http, $interval) {

			var vm = this;

			vm.user = {};
			vm.pool = {};
			vm.shifts = {};
			vm.blocks = {};

			vm.message = '';
			vm.showMessage = false;

			function updateUser(response) {
				vm.user = response.data;
			}

			function updatePool(response) {
				vm.pool = response.data;
			}

			function updateShifts(response) {
				vm.shifts = response.data;
			}

			function updateBtcBlocks(response){
				vm.blocks.BTC = response.data;
			}

			function updateNmcBlocks(response){
				vm.blocks.NMC = response.data;
			}

			function handleError() {
				vm.message = 'Server not responding.';
				vm.showMessage = true;
			}

			function fetchData() {
				$http.get('/api/user').then(updateUser, handleError);
				$http.get('/api/pool/stats').then(updatePool, handleError);
				$http.get('/api/pool/shifts').then(updateShifts, handleError);
				$http.get('/api/pool/blocks/btc').then(updateBtcBlocks, handleError);
				$http.get('/api/pool/blocks/nmc').then(updateNmcBlocks, handleError);
			}

			fetchData();

			// Fetch new data every 10 sec..
			$interval(fetchData, 10000);

		}]
	);


	app.directive('hashRate', function () {
		return {
			restrict: 'E',
			replace: 'true',
			scope: {
				userhash: '@',
				poolhash: '@',
				workers: '@',
				users: '@'
			},
			link: function(scope, elem, attrs){

			},
			templateUrl: 'modules/templates/hashrate.html'
		};
	});


	app.directive('balance', function () {
		return {
			restrict: 'E',
			replace: 'true',
			scope: {
				btc: '@',
				nmc: '@'
			},
			link: function(scope, elem, attrs){

			},
			templateUrl: 'modules/templates/balance.html'
		};
	});


})();