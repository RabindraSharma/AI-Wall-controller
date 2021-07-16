'use strict';

angular
		.module('webappApp')
		.service(
				'layoutv2service',
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
