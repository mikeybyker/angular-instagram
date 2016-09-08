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
        )
        // auth0 stopped (August 2016) sending the IdP access_token : need a backend proxy
        // A webtask will do it...see readme...else write your backend code to do the same
        .constant('webtask',
            {
                api: 'https://webtask.it.auth0.com/api/run/wt-mikeybyker-gmail_com-0/ext_idp_webtask/call_ext_api?webtask_no_cache=1'
            }
        );

}());
