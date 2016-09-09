# Angular Instagram

[![Build Status](https://travis-ci.org/mikeybyker/angular-instagram.svg?branch=master)](https://travis-ci.org/mikeybyker/angular-instagram)

An angular app using auth0 to manage authentication with the Instagram api. Currently just displays recent images - can add any of the [Instagram Endpoints](https://www.instagram.com/developer/endpoints/) to instagram.service.js - once authenticated you can access any you like.


### Uses
Angular, Bootstrap (sass), Popeye, Auth0-Angular & Lock, UI-Router.
Scaffolding/setup is with [generator-gulp-angular
](https://github.com/Swiip/generator-gulp-angular)

### Installation
```javascript
npm install
```

### Run
```javascript
gulp serve
```

### Setup Instagram
  - Login to [Instagram](https://www.instagram.com/developer/) > register a new Client
  - Security tab > Add valid redirect URIs (include the auth0 callback eg. https://yourdomain.auth0.com/login/callback)
  - Take a note of Client ID and Client Secret

### Setup Auth0
  - Login to [auth0](https://auth0.com/) > create new app/api
  - Add allowed callbacks/CORS
  - Connections > Social > Turn on Instagram - add the Client ID and Client Secret from above

### Setup Backend
Since August 2016, auth0 sadly (but understandably - https://auth0.com/docs/migrations) stopped sending the IdP access token when you log in. Access to 3rd party APIs can no longer be achieved with a serverless setup.
A backend proxy is needed to handle getting the access token from auth0 for use with (in this case) Instagram. I've used a [webtask](https://webtask.io/) to do this.
@todo: webtask setup info...


##### Add your [auth0](https://auth0.com/) domain and clientID to **index.constants.js**

### Version
0.3.0

Mike