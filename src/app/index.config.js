(function() {
    'use strict';

    angular
        .module('instagram')
        .config(config);

    function config($logProvider, toastrConfig, authProvider, authconfig) {

        $logProvider.debugEnabled(true);

        toastrConfig.allowHtml = true;
        toastrConfig.timeOut = 3000;
        toastrConfig.positionClass = 'toast-top-center';
        toastrConfig.preventDuplicates = true;
        toastrConfig.progressBar = true;

        authProvider.on('logout', function($state) {
            $state.go('home');
        });

        // authProvider.on('authenticated', function($state) {            
        //     console.log('authProvider (on) authenticated');
        // });
        // authProvider.on('loginFailure', function() {
        //     console.log('Error');
        // });

        authProvider.init(authconfig);

    }

}());

/*
    // Alternative login action: Let the authProvider do it...
    authProvider.on('loginSuccess', function($state, profilePromise, idToken, store) {
        // console.log('Login Success');
        profilePromise.then(function(profile) {
          store.set('profile', profile);
          store.set('token', idToken);
          store.set('access_token', profile.identities[0].access_token);
        }).finally(function(a){
            // Only after saving the profile etc. change state
            $state.go('photos');
        });
    });
*/