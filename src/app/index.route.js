(function() {
    'use strict';

    angular
        .module('instagram')
        .config(routerConfig);

    /** @ngInject */
    function routerConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
        .state('home', {
            url: '/',
            templateUrl: 'app/login/login.html',
            controller: 'LoginController',
            controllerAs: 'vm',
            resolve: {
                skipIfAuthenticated: _skipIfAuthenticated
            }
        })
        .state('about', {
            url: '/about',
            templateUrl: 'app/about/about.html',
            controller: 'AboutController',
            controllerAs: 'vm'
        })
        .state('photos', {
            url: '/photos',
            templateUrl: 'app/instagram/photos.html',
            controller: 'PhotosController',
            controllerAs: 'vm',
            data: {
                requiresLogin: true
            }
        });

        $urlRouterProvider.otherwise('/');
    }

    function _skipIfAuthenticated($q, $state, auth, $log) {
        var defer = $q.defer();
        if(auth.isAuthenticated) {
            $log.info('Already logged in...no need to try again :-)');
            defer.reject();
        } else {
            defer.resolve();
        }
        return defer.promise;
    }

}());