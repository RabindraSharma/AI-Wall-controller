'use strict';

/**
 * @ngdoc overview
 * @name webappApp
 * @description
 * # webappApp
 *
 * Main module of the application.
 */
angular
  .module('webappApp', [
    'ngRoute'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'resources/app/views/main.html',
        controller: 'MainCtrl'
      })
      .when('/list', {
        templateUrl: 'resources/app/views/list-currency.html',
        controller: 'CurrencyController'
      })
      .when('/search', {
        templateUrl: 'resources/app/views/search-currency.html',
        controller: 'CurrencyController'
      })
      .when('/convert', {
        templateUrl: 'resources/app/views/convert-currency.html',
        controller: 'CurrencyController'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
