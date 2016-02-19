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
                            return $q.reject(response.data.meta.error_message)
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

            return {

                getRecent: function(options){
                    var url = 'https://api.instagram.com/v1/users/self/media/recent/';
                    return getData(url, options);
                }
            };
        });

}());