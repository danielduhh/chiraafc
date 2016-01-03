/**
 * Created by SpatialDev on 1/26/15.
 */

/**
 * Created by SpatialDev on 1/21/15.
 */

var StyleLoader = angular.module('ChiraaFC',['ui.router']).config([
    '$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: '/index.html',
                controller: 'MainCtrl'
            });

        $urlRouterProvider.otherwise('home');
    }]);

