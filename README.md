# Angular Instagram

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

##### Add your [auth0](https://auth0.com/) domain and clientID to **index.constants.js**

### Version
0.0.1

Mike