(function(){
    'use strict';

    angular
        .module('instagram')
        .factory('InstagramService', function($http, $q, store){

            function getParams(options){
                var access_token = store.get('access_token');
                if(!access_token){
                    return null;
                }
                // return angular.extend(options || {}, {access_token: access_token});
                return angular.extend(options || {}, {access_token: access_token, callback: 'JSON_CALLBACK'});
            }

            /*
            * Leaving the original code in,
            * just as an illustration of how easy it was prior to the auth0 changes
            * that made using a proxy a requirement
            */
            function getDataDirect(api_url, options){
                    var params = getParams(options);
                    if(!api_url || !params){
                        return reject({status:500, statusText:'No access token'});
                    }
                    // If CORS would let us...
                    // return $http({
                    //       method: 'GET',
                    //       url: api_url,
                    //       params: params
                    // });
                    return $http({
                          method: 'JSONP',
                          url: api_url,
                          params: params
                    })
                        .then(function(response){
                            if(!response.data.meta || response.data.meta.code !== 200){
                                return $q.reject(response.data.meta.error_message);
                            }
                            return response.data.data; // return the photos array
                        });
            }

            function reject(reason){
                reason = reason || {status:404, statusText:'Not Found'};
                var deferred = $q.defer();
                deferred.reject(reason);
                return deferred.promise;
            }

            /**
            * Via a proxy : In this case, a webtask.io task
            * This is because auth0 stopped (August 2016) sending the
            * IdP access_token needed to talk to Instagram
            */
            function getData(proxy_url, api_url, options){
                var idToken = store.get('token'),
                    // Any param ending in $ will have the $ removed,
                    // and value set to the correct idp_access_token
                    params = {
                            api_url: api_url,
                            access_token$: 'WEBTASK_WILL_REPLACE_ME',
                            webtask_no_cache: 1
                    },
                    data = angular.extend(options || {}, params),
                    headers = {'Authorization': 'Bearer ' + idToken};
                if(!idToken){
                    return $q.reject({status:500, statusText:'No id token...'});
                } else if(!proxy_url || !api_url){
                    return $q.reject({status:500, statusText:'No api urls provided...'});
                }
                return  $http({
                            method: 'POST',
                            url: proxy_url,
                            headers: headers,
                            data:data
                        })
                        .then(function(response){
                            var data;
                            // proxy wraps instagram data in another data property...
                            if(!response.data || !response.data.data){
                                return $q.reject('Data returned is just wrong. That is all.');
                            }
                            data = response.data.data;
                            if(!data.meta || data.meta.code !== 200){
                                return $q.reject(data.meta ? data.meta.error_message : 'Error');
                            }
                            return data.data; // return the photos array
                        });
            }

            return {
                // original - access tokens were supplied by auth0
                getDataDirect: function(options){
                    var api_url = 'https://api.instagram.com/v1/users/self/media/recent/';
                    return getDataDirect(api_url, options);
                },
                // new - have to use server side code to grab the access token
                getRecent: function(proxy_url, options){
                    var api_url = 'https://api.instagram.com/v1/users/self/media/recent/';
                    return getData(proxy_url, api_url, options);
                }
            };
        });

}());
