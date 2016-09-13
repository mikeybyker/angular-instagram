(function() {
    'use strict';

    angular
        .module('instagram')
        .config(routerConfig);

    function routerConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'app/login/login.html',
                controller: 'LoginController',
                controllerAs: 'vm'
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

}());