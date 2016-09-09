(function() {
    'use strict';

    angular
        .module('instagram')
        .controller('LoginController', LoginController);

    function LoginController(auth, $state, store, InstagramService, $log, $http) {
        var vm = this;

        vm.auth = auth;
        vm.login = login;
        vm.viewPhotos = viewPhotos;

        function login(){
            auth.signin({
              authParams: {
                    scope: 'openid name email public_content follower_list',
                    connection_scopes: {
                      'instagram': ['public_content follower_list']
                    }
              },
              connections: ['instagram']
            }, function(profile, idToken) {
                saveUserInfo(profile, idToken);
                $state.go('photos');
                // let the authProvider > loginSuccess do the rest...
                // OR THIS? NOTE: TEST SPEC > CHANGE TO SUIT
            }, function(err) {
                $log.warn('Error :(', err);
            });
        }
        var saveUserInfo = function(profile, token) {
            store.set('profile', profile);
            store.set('token', token);
            // @WARN : No more access_token. Serverless not possible with auth0, sadly.
            // See: https://auth0.com/docs/migrations
            // store.set('access_token', profile.identities[0].access_token);
        }


        function viewPhotos(){
            if(vm.auth.isAuthenticated){
                $state.go('photos');
            }
        }
    }
}());
