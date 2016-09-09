(function() {
    'use strict';

    angular
        .module('instagram')
        .component('navbar', {
            controller: function($location, auth, store){

                var $ctrl = this;
                this.logout = logout;
                this.auth = auth;

                function logout(){
                    auth.signout();
                    store.remove('profile');
                    store.remove('token');
                    store.remove('access_token');
                }

            },
            templateUrl: 'app/components/navbar/navbar.html'
        });

})();
