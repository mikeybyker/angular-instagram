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
        )
        // auth0 stopped (August 2016) sending the IdP access_token : need a backend proxy
        // A webtask will do it...
        // See README for webtask info...else write your backend code to do the same
        .constant('webtask',
            {
                api: 'YOUR_WEBTASK_URL'
            }
        );

}());
