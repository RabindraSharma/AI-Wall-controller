'use strict';

/**
 * @ngdoc function
 * @name webappApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the webappApp
 */

angular.module('webappApp').controller(
		'Layoutv2Controller',
		function($rootScope,$scope, $location,$window,$http, layoutv2service) {
			$scope.token = '';
			$rootScope.token = '';
			$scope.loadDisplays = function() {
				$scope.token = sessionStorage.getItem('token');
				layoutv2service.getNoUserDisplays().success(function(data) {
					var messages = data.result;
					$scope.displays = JSON.parse(messages);
				}).error(function(data) {
					console.log("error in getting displays");
				});
				layoutv2service.getPin().success(function(data) {
					$scope.pin = JSON.parse(data);
				}).error(function(data) {
					console.log("error in getting pin");
				});
				layoutv2service.getProjectCode().success(function(data) {
					$scope.projectcode = data;
				}).error(function(data) {
					console.log("error in getting pin");
				});
			}
			
			
			$scope.loadlayout = function(displayid,zone, layoutname) {
				
				$scope.token = sessionStorage.getItem('token');
				layoutv2service.loadlayout($scope.token, displayid,zone, layoutname).success(
						function(data) {
							console.log("successfully loaded " + layoutname
									+ " on display " + displayid);
						}).error(function(data) {
					console.log("error"+data);
				});

			}
			
			$scope.authenticate = function() {
				layoutv2service.authenticate($scope.username,$scope.pass).success(
						function(data) {
							 console.log("successfully authenticate " + $scope.username);
							 $scope.token = $scope.username + ":" + $scope.pass;
							 $rootScope.token = $scope.username + ":" + $scope.pass;
							 console.log("Token " + $scope.token);
							 sessionStorage.setItem('token', $scope.token);
							 $scope.errorMessage = '';
							 var htmldata = data.html;
							 var hoststring = '$window.location.host';
							 if(htmldata.indexOf(hoststring)!=-1){
								 var redirecturl = htmldata.replace(hoststring,$window.location.hostname);
								 $window.location.replace(redirecturl);
							 }else{
								 $window.location.href = '/layout2.html';
							 }
						}).error(function(data) {
							$scope.errorMessage = 'Wrong username and password';
							console.log("error"+data);
				});
			}
			
			$scope.redirect = function(displayid) {
				window.open('http://'+displayid+':8070/', '_blank');
			}
			
			$scope.encryptpassword = function(password) {
				layoutv2service.encryptpassword(password).success(
						function(data) {
							var string = data.result;
						}).error(function(data) {
					console.log("error"+data);
				});
			}
		});
