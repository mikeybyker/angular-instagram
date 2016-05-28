(function() {
    'use strict';

    angular
        .module('instagram')
        .run(runBlock);

    /** @ngInject */
    function runBlock($log, $rootScope, auth, store, jwtHelper, $state) {

        auth.hookEvents();

        // This events gets triggered on refresh or URL change
        $rootScope.$on('$locationChangeStart', function() {
            var token = store.get('token');
            if (token) {
                if (!jwtHelper.isTokenExpired(token)) {
                    if (!auth.isAuthenticated) {
                        auth.authenticate(store.get('profile'), token);
                    }
                } else {
                    // Either show the login page or use the refresh token to get a new idToken
                    $state.go('home');
                }
            }
        });

        // $rootScope.$on('$stateChangeStart',function(event,next)
        // {
        //     if(next.url === '/' && auth.isAuthenticated)
        //     {
        //         event.preventDefault();
        //         $log.info('Already logged in...no need to try again :-)');
        //     }
        // });

        $log.debug('runBlock end');
    }

}());