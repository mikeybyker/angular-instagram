(function() {
    'use strict';

    angular
        .module('instagram')
        .config(config);

    /** @ngInject */
    function config($logProvider, toastrConfig, authProvider, authconfig) {
        // Enable log
        $logProvider.debugEnabled(true);

        // Set options third-party lib
        toastrConfig.allowHtml = true;
        toastrConfig.timeOut = 3000;
        toastrConfig.positionClass = 'toast-top-center';
        toastrConfig.preventDuplicates = true;
        toastrConfig.progressBar = true;

        authProvider.on('authenticated', function($state) {
            // This is after a refresh of the page
            // If the user is still authenticated, you get this event
            $state.go('photos');
        });

        authProvider.on('logout', function($state) {
            $state.go('home');
        });

        authProvider.init(authconfig);

    }

}());