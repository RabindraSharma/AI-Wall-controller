'use strict';

/**
 * @ngdoc function
 * @name webappApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the webappApp
 */

var scheduleApp = angular.module("scheduleApp", []);

scheduleApp.controller('scheduleController', function($rootScope, $scope, $http) {
  
	$scope.loadSchedules = function() {
		var str = '/app/gui/users/schedules/list';
		var promise = $http.get(str);
		promise.success(function(data) {
			var jsonData =JSON.stringify(data);
		
			var obj=JSON.parse(jsonData);
			$scope.schedules = obj;
		}).error(function(data) {
			
			console.log("error in getting schedules");
		});
		
	}
	
	$scope.start = function(displaypc,zonename,schedulename) {
		var str = '/app/gui/'+displaypc+'/'+zonename+'/schedule/'+schedulename+'/start';
		var promise = $http.get(str);
		promise.success(function(data) {
			var jsonData =JSON.stringify(data);
			var obj=JSON.parse(jsonData);
			$scope.schedules = obj;
		}).error(function(data) {
			console.log("error in getting schedules");
		});
		
	}
	
	$scope.stop = function(displaypc,zonename,schedulename) {
		var str = '/app/gui/'+displaypc+'/'+zonename+'/schedule/'+schedulename+'/stop';
		var promise = $http.get(str);
		promise.success(function(data) {
			var jsonData =JSON.stringify(data);
			
			var obj=JSON.parse(jsonData);
			$scope.schedules = obj;
		}).error(function(data) {
			
			console.log("error in getting schedules");
		});
		
	}
	
});
