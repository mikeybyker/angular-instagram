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

            function getData(url, options){
                    var params = getParams(options);
                    if(!url || !params){
                        return reject({status:500, statusText:'No access token'});
                    }
                    // If CORS would let us...
                    // return $http({
                    //       method: 'GET',
                    //       url: url,
                    //       params: params
                    // });
                    return $http({
                          method: 'JSONP',
                          url: url,
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

            // Going via a proxy : In this case, a webtask.io task
            // This is because auth0 stopped (August 2016) sending the IdP access_token
            function getDataProxy(webtask, api_url, options){
                var idToken = store.get('token'),
                    params = {
                            api_url: api_url,
                            access_token: 'WEBTASK_WILL_REPLACE_ME'
                    },
                    data = angular.extend(options || {}, params),
                    headers = {'Authorization': 'Bearer ' + idToken};
                if(!idToken || !webtask || !api_url){
                    return $q.reject({status:404, statusText:'No id token...'});
                }
                return $http({
                    method: 'POST',
                    url: webtask,
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
                            return $q.reject(data.meta.error_message);
                        }
                        return data.data; // return the photos array
                    });
            }

            return {
                getRecent: function(options){
                    var url = 'https://api.instagram.com/v1/users/self/media/recent/';
                    return getData(url, options);
                },
                getRecentProxy: function(webtask, options){
                    var api_url = 'https://api.instagram.com/v1/users/self/media/recent/';
                    return getDataProxy(webtask, api_url, options);
                }
            };
        });

}());
