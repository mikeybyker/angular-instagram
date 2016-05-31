(function() {
    'use strict';

    angular
        .module('instagram')
        // Stick your own auth0 config data here...
        .constant('authconfig',
            {
                domain: 'YOUR_AUTH0_DOMAIN',
                clientID: 'YOUR_CLIENT_ID',
                callbackUrl: location.href,
                loginState: 'home'
            }
        );

}());
