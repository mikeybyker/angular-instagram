// Very much based on: https://github.com/vikasjayaram/ext-idp-api-webtask
// Just added querystring functionality (eg. instagram needs access_token in the qs)
"use strict";

 const jwt     = require('jsonwebtoken');
 const moment  = require('moment');
 const request = require('request');
 const express = require('express');
 const Webtask = require('webtask-tools');
 const async   = require('async');
 const app     = express();

 /*
 * Local variables
 */
 let accessToken = null;
 let lastLogin = null;

 app.post('/call_ext_api', function (req, res) {
   if (!req.headers['authorization']){ return res.status(401).json({ error: 'unauthorized'}); }
   const context = req.webtaskContext;
   const token = req.headers['authorization'].split(' ')[1];
   const reqBody = req.webtaskContext.body;
   if (!reqBody) {
     return res.status(400).json({error: 'api_url is required'});
   }
   async.waterfall([
     async.apply(verifyJWT, context, reqBody, token),
     getAccessToken,
     getUserProfile,
     callExtIDPApi
   ], function (err, result) {
     if (err) return res.status(400).json({error: err});
     return res.status(200).json({data: result});
   });
 });
/*
* Verify that the user id_token is signed by the correct Auth0 client
*/
function verifyJWT(context, reqBody, token, cb) {
   return jwt.verify(token, new Buffer(context.data.ID_TOKEN_CLIENT_SECRET, 'base64'), function(err, decoded) {
     if (err) return cb(err);
     cb(null, context, reqBody, decoded);
   });
};
/*
* Request a Auth0 access token every 30 minutes
*/
function getAccessToken(context, reqBody, decoded, cb) {
   if (!accessToken || !lastLogin || moment(new Date()).diff(lastLogin, 'minutes') > 30) {
     const options = {
       url: 'https://' + context.data.ACCOUNT_NAME + '.auth0.com/oauth/token',
       json: {
         audience: 'https://' + context.data.ACCOUNT_NAME + '.auth0.com/api/v2/',
         grant_type: 'client_credentials',
         client_id: context.data.CLIENT_ID,
         client_secret: context.data.CLIENT_SECRET
       }
     };

     return request.post(options, function(err, response, body){
       if (err) return cb(err);
       else {
         lastLogin = moment();
         accessToken = body.access_token;
         return cb(null, context, reqBody, decoded, accessToken);
       }
     });
   } else {
     return cb(null, context, reqBody, decoded, accessToken);
   }
 };

/*
* Get the complete user profile with the read:user_idp_token scope
*/
function getUserProfile(context, reqBody, decoded, token, cb){
   const options = {
     url: 'https://' + context.data.ACCOUNT_NAME + '.auth0.com/api/v2/users/' + decoded.sub,
     json: true,
     headers: {
       authorization: 'Bearer ' + token
     }
   };

  request.get(options, function(error, response, user){
     return cb(error, context, reqBody, user);
   });
 };

/*
* Call the External API with the IDP access token to return data back to the client.
*/
function callExtIDPApi (context, reqBody, user, cb) {
  let idp_access_token = null;
  const api = reqBody.api_url;
  const provider = user.user_id.split('|')[0];
  /*
  * Checks for the identities array in the user profile
  * Matches the access_token with the user_id provider/strategy
  */
  if (user && user.identities) {
    for (var i = 0; i < user.identities.length; i++) {
      if (user.identities[i].access_token && user.identities[i].provider === provider) {
        idp_access_token = user.identities[i].access_token;
        i = user.identities.length;
      }
    }
  }
  if (idp_access_token) {
    // Added qs...
    var qs = getQSParams(reqBody, idp_access_token),
        options = {
          method: 'GET',
          url: api,
          qs: qs,
          headers: {Authorization: 'Bearer ' + idp_access_token}
        };
    request(options, function (error, response, body) {
      if (error) cb(error);
      cb(null, JSON.parse(body));
    });
  } else {
    cb({error: 'No Access Token Available'});
  }
};

/*
* Pick up any additional options sent in the request body
*/
function getQSParams(reqBody, idp_access_token){
    var qs = Object.assign({}, reqBody);
    delete qs.api_url; // do not need in the qs

    // Any param sent in ending in '$' will have that $ removed, and given the value of idp_access_token
    // eg. instagram wants 'access_token' - so send in access_token$ = 'WEBTASK_WILL_REPLACE_ME'
    for (var key in qs) {
        if(key.endsWith('$')){
          qs[key.slice(0,-1)] = idp_access_token; // update with the correct value
          delete qs[key];
        }
    }
    return qs;
}

module.exports = Webtask.fromExpress(app);


/*
    Since August 2016, auth0 stopped sending the IdP access_token : need a backend proxy

    So - create a Non Interactive client : 
    see : https://auth0.com/docs/what-to-do-once-the-user-is-logged-in/calling-an-external-idp-api

    Install webtask:
    npm install wt-cli -g
    see: https://webtask.io/cli

    Create the webtask with this file, passing in the details found in auth0 console
    (need client id & secret from the non interactive client,
    plus the secret from the app/client that needs the 3rd party access)

    wt create ext_idp_webtask.js
        -s CLIENT_ID=YOUR_NON_INTERACTIVE_AUTH0_CLIENT_ID
        -s CLIENT_SECRET=YOUR_NON_INTERACTIVE_AUTHO_CLIENT_SECRET
        -s ACCOUNT_NAME=YOUR_AUTH0_TENANT_NAME                      (e.g. yourdomain.eu)
        -s ID_TOKEN_CLIENT_SECRET=YOUR_CLIENT_SECRET

    You will get a webtask url returned, which you can use in the app.
*/ 