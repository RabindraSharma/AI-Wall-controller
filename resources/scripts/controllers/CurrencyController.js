'use strict';

/**
 * @ngdoc function
 * @name webappApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the webappApp
 */

angular.module('webappApp').controller(
		'CurrencyController',
		function($rootScope,$scope, $location,$window,$http, currencyservice) {
			$scope.token = '';
			$rootScope.token = '';
			$scope.loadDisplays = function() {
				$scope.token = sessionStorage.getItem('token');
				currencyservice.getDisplays($scope.token).success(function(data) {
					var messages = data.result;
					$scope.displays = JSON.parse(messages);
				}).error(function(data) {
					console.log("error in getting displays");
				});
				
				currencyservice.getProjectCode().success(function(data) {
					$scope.projectcode = data;
				}).error(function(data) {
					console.log("error in getting code");
				});
				
				currencyservice.isAudioLicense().success(function(data) {
					$scope.isAudioLicense = data;
				}).error(function(error) {
					console.log("error in getting audio license status"+error);
				});
				
				currencyservice.getPin().success(function(data) {
					$scope.pin = JSON.parse(data);
				}).error(function(data) {
					console.log("error in getting pin");
				});
			}
			
			$scope.getAudioLicense = function() {
				currencyservice.isAudioLicense().success(function(data) {
					$scope.isAudioLicense = data;
				}).error(function(error) {
					console.log("error in getting audio license status"+error);
				});
				return $scope.isAudioLicense; 
			}
			
			$scope.loadSchedules = function() {
				$scope.token = sessionStorage.getItem('token');
				var str = '/app/gui/users/schedules/list';
				currencyservice.loadSchedules($scope.token).success(function(data) {
					var jsonData =JSON.stringify(data);
					var obj=JSON.parse(jsonData);
					$scope.schedules = obj;
				}).error(function(data) {
					console.log("error in getting schedules");
				});
				currencyservice.getPin().success(function(data) {
					$scope.pin = JSON.parse(data);
				}).error(function(data) {
					console.log("error in getting pin");
				});
			}
			
			$scope.startSchedule = function(displaypc,zonename,schedulename) {
				$scope.token = sessionStorage.getItem('token');
				currencyservice.startSchedule($scope.token,displaypc,zonename,schedulename).success(function(data) {
					console.log("started schedule successfully.");
					window.location.reload();
				}).error(function(data) {
					console.log("error in starting schedule");
				});
			}
			
			$scope.stopSchedule = function(displaypc,zonename,schedulename) {
				var str = '/app/gui/'+displaypc+'/'+zonename+'/schedule/'+schedulename+'/stop';
				currencyservice.stopSchedule(displaypc,zonename,schedulename).success(function(data) {
					console.log("stopped schedule successfully.");
					window.location.reload();
				}).error(function(data) {
					console.log("error in stopping schedule");
				});
			}
			
			$scope.loadDisplaysSources = function() {
				currencyservice.getNoUserDisplays().success(function(data) {
					var messages = data.result;
					$scope.displays = JSON.parse(messages);
				}).error(function(data) {
					console.log("error in getting displays");
				});
				currencyservice.getSources().success(function(data) {
					var messages = data.result;
					$scope.sources = JSON.parse(messages);
				}).error(function(data) {
					console.log("error in getting sources");
				});
				
			}
			
			$scope.loadlayout = function(displayid,zone, layoutname) {
				$scope.token = sessionStorage.getItem('token');
				currencyservice.loadlayout($scope.token, displayid,zone, layoutname).success(
						function(data) {
							console.log("successfully loaded " + layoutname
									+ " on display " + displayid);
						}).error(function(data) {
					console.log("error"+data);
				});

			}
			
			$scope.authenticate = function() {
				currencyservice.authenticate($scope.username,$scope.pass).success(
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
								 $window.location.href = htmldata;	 
							 }
						}).error(function(data) {
							$scope.errorMessage = 'Wrong username and password';
							console.log("error"+data);
				});
			}
			
			$scope.redirect = function(displayid) {
				var host = displayid.split(/[ ]+/)[1];
				window.open('http://'+host+':8070/', '_blank');
			}
			
			$scope.openAudioManager = function(displayid) {
				var host = displayid.split(/[ ]+/)[1];
				window.open('https://'+host+':8998', '_blank');
				//window.open('http://'+host+':8999/html/audio.html', '_blank');
			}
			
			$scope.encryptpassword = function(password) {
				currencyservice.encryptpassword(password).success(
						function(data) {
							var string = data.result;
						}).error(function(data) {
					console.log("error"+data);
				});
			}
		});
