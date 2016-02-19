(function() {
    'use strict';

    angular
        .module('instagram')
        .controller('LoginController', LoginController);

    /** @ngInject */
    function LoginController(auth, $state, store, InstagramService, $log) {
        var vm = this;

        vm.login = login;

        function login(){
            auth.signin({
              authParams: {
                    scope: 'openid name email public_content follower_list',
                    connection_scopes: {
                      'instagram': ['public_content follower_list']
                    }
              },
              connections: ['instagram']
            }, function(profile, idToken /*, accessToken, state, refreshToken*/) {
                saveUserInfo(profile, idToken);
                $state.go('photos');
            }, function(err) {
                $log.log('Error :(', err);
            });
        }
        var saveUserInfo = function(profile, token) {
            store.set('profile', profile);
            store.set('token', token);
            store.set('access_token', profile.identities[0].access_token);
        }
    }
}());