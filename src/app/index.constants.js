(function() {
    'use strict';

    angular
        .module('instagram')
        // Stick your own auth0 config data here...
        .constant('authconfig',
            {
                domain: 'sinisterwaltz.eu.auth0.com',
                clientID: 'pUbBjs4rFIcsMyLZGutLZ2Tz64H5qQO0',
                callbackUrl: location.href,
                loginState: 'home'
            }
        );

}());
