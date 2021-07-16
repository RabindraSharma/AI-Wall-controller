'use strict';

angular
		.module('webappApp')
		.service(
				'currencyservice',
				function($rootScope, $http, $q, $location,$log) {
					
					// AngularJS will instantiate a singleton by calling "new"
					// on this function
					return {
						getPin : function() {
							var str = '/app/pin';
							var request = $http.get(str);
							return request;
						},
						getProjectCode : function() {
							var str = '/app/code';
							var request = $http.get(str);
							return request;
						},
						isAudioLicense: function() {
							var str = '/app/audio/license/status';
							var request = $http.get(str);
							return request;
						},
						getSources : function() {
							var str = '/app/gui/sources/list';
							var request = $http.get(str);
							return request;
						},
						getNoUserDisplays : function() {
							var str = '/app/gui/displays/list';
							var request = $http.get(str);
							return request;
						},
						getDisplays : function(token) {
							var str = '/app/gui/users/displays/list';
							var request = $http.get(str,   {
								headers: {
						              "Authorization" : "Basic " + window.btoa(token)
						          }
						    });
							return request;
						},
						loadSchedules : function(token) {
							var str = '/app/gui/users/schedules/list';
							var request = $http.get(str,   {
								headers: {
						              "Authorization" : "Basic " + window.btoa(token)
						          }
						    });
							return request;
						},
						startSchedule : function(token,displaypc,zonename,schedulename) {
							var str = '/app/gui/'+displaypc+'/'+zonename+'/schedule/'+schedulename+'/start';
							var request = $http.get(str,   {
								headers: {
						              "Authorization" : "Basic " + window.btoa(token)
						          }
						    });
							return request;
						},
						stopSchedule : function(displaypc,zonename,schedulename) {
							var str = '/app/gui/'+displaypc+'/'+zonename+'/schedule/'+schedulename+'/stop';
							var request = $http.get(str);
							return request;
						},
						loadlayout : function(token, displayid,zone, layoutname) {
							var str = '/app/gui/'
								+ displayid+'/'+zone+'/layout/'
								+ layoutname + '/load';
							var request = $http.get(str,   {
								headers: {
						              "Authorization" : "Basic " + window.btoa(token)
						          }
						    });
							return request;
						},
						encryptpassword : function(password) {
							var str = '/app/gui/'
								+ password + '/encrypt/';
							var request = $http
									.get(str);
							return request;
						},
						authenticate : function(username, password) {
							var str = '/app/gui/authenticate';
							var request = $http.get(str,   {
								 headers: {
						              "Authorization" : "Basic " + window.btoa(username + ":" + password)
						          }
						    });
							return request;
						}
						
					};

				});
