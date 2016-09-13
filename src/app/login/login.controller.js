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
            }, function(err) {
                $log.warn('Error :(', err);
            });
        }
        var saveUserInfo = function(profile, token) {
            store.set('profile', profile);
            store.set('token', token);
        }

        function viewPhotos(){
            if(vm.auth.isAuthenticated){
                $state.go('photos');
            }
        }
    }
}());
