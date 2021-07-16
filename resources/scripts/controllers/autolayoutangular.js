'use strict';

/**
 * @ngdoc function
 * @name webappApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the webappApp
 */

var app = angular.module('autolayoutapp', []);
app.service(
		'autolayoutservice',
		function($rootScope, $http, $q, $location,$log) {
			
			// AngularJS will instantiate a singleton by calling "new"
			// on this function
			return {
				
				unsharedefaultlayout  : function(displayid) {
					var str = '/app/gui/'+displayid+'/zone/layout/unshare';
					var request =  $http.get(str)
					return request;
				},
				
				loaddefaultlayout : function(displayid,sourcename) {
					var str = '/app/gui/'+displayid+'/zone/layout/load';
					var data = 
					{'name':'auto-'+sourcename, 'rows' : '1','columns' : '1', 'isActive':'false', 'references' : [{'source':sourcename, 'sourcecordinates':{'coordinates':['0,0']}}]}
					var request =  $http.post(str, data)
					return request;
				},
				loadautolayout : function(displayid,datavalues) {
					var str = '/app/gui/'+displayid+'/zone/layout/load';
					var request =  $http.post(str, datavalues)
					return request;
				},
				getAutolayouts : function() {
					var str = '/app/gui/autolayouts/list';
					var request = $http.get(str);
					return request;
				}
				
			};

		});
app.controller('autolayoutcontroller', function($scope, $location,$window, autolayoutservice) {
	$scope.token = '';
	
		$scope.loadDisplaysSources = function() {
		autolayoutservice.getAutolayouts().success(function(data) {
			var messages = data.result;
			$scope.autolayoutsDisplay = JSON.parse(messages);
		}).error(function(data) {
			console.log("error in getting displays");
		});
		
	}
	
	$scope.loaddefaultlayout = function(displayid,sourcename) {
		autolayoutservice.loaddefaultlayout(displayid,sourcename).success(
				function(data) {
					console.log("successfully loaded " + sourcename
							+ " on display " + displayid);
					alert('Please click "UnshareAll" button after your quick view is done.')
				}).error(function(data) {
			console.log("error"+data);
		});

	}
	
	$scope.loadautolayout = function(displayid,datavalues) {
		autolayoutservice.loadautolayout(displayid,datavalues).success(
				function(data) {
					console.log("successfully loaded " + data
							+ " on display " + displayid);
					alert('Please click "UnshareAll" button after your quick view is done.')
				}).error(function(data) {
			console.log("error"+data);
		});

	}
	
	$scope.unsharedefaultlayout= function(displayid) {
		autolayoutservice.unsharedefaultlayout(displayid).success(
				function(data) {
					console.log("successfully unshareall on display " + displayid);
				}).error(function(data) {
			console.log("error"+data);
		});

	}
});

