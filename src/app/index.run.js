(function() {
    'use strict';

    angular
        .module('instagram')
        .run(runBlock);

    function runBlock($log, $rootScope, auth, store, jwtHelper, $state) {

        auth.hookEvents();
        $rootScope.$on('$locationChangeStart', function() {
            var token = store.get('token');
            if (token) {

                if (!jwtHelper.isTokenExpired(token)) {
                    if (!auth.isAuthenticated) {

                        auth.authenticate(store.get('profile'), token)
                            .then(function (profile) {
                                $log.info('Authenticated with token');
                                // $log.info(profile);
                                // $state.go('photos'); // No need
                            }, function (err) { $log.info('error : ', err);});
                    }
                } else {
                    // Either show the login page or use the refresh token to get a new idToken
                    $state.go('home');
                }
            }
        });

    }

}());
