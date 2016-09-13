(function() {
    'use strict';

    describe('service InstagramService', function(){

            var profile = angular.fromJson('{"picture":"","name":"Mike","nickname":"mikeybyker","counts":{"media":100,"followed_by":100,"follows":100},"clientID":"XXX","updated_at":"2016-02-18T11:41:11.665Z","user_id":"instagram|12345678","identities":[{"access_token":"12345678.9123456.789123456789abc","provider":"instagram","user_id":"12345678","connection":"instagram","isSocial":true}],"created_at":"2016-02-15T16:49:05.573Z","global_client_id":"YYYYY"}'),
            token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2p3dC1pZHAuZXhhbXBsZS5jb20iLCJzdWIiOiJtYWlsdG86bWlrZUBleGFtcGxlLmNvbSIsIm5iZiI6MTQ3Mzc1MzE2NCwiZXhwIjoxODUyNDQ0MTY4LCJpYXQiOjE0NzM3NTMxNjQsImp0aSI6ImlkMTIzNDU2IiwidHlwIjoiaHR0cHM6Ly9leGFtcGxlLmNvbS9yZWdpc3RlciJ9.VRnLwZoG7SwTLEMUG0_TBwsSaPR6fdcf_JUuFH6d5OY',
            webtask = 'https://webtask.it.auth0.com/api/run/wt-someone-gmail_com-0/ext_idp_webtask/call_ext_api';

        beforeEach(module('instagram'));

        beforeEach(inject(function(_$rootScope_, _authUtils_) {
            var $rootScope = _$rootScope_;
            /* eslint-disable */
            // *fix* auth0 error : Very temperamental: why is it happening?! (and it didn't once or twice...)
            // test:auto - everything passes. Single run goes mad.
            var safeApply = function(fn) {
                    if(!$rootScope.$root){return;} // this fixing the testing error...
                    var phase = $rootScope.$root.$$phase;
                    if(phase === '$apply' || phase === '$digest') {
                        if(fn && (typeof(fn) === 'function')) {
                            fn();
                        }
                    } else {
                        $rootScope.$apply(fn);
                    }
                };
            /* eslint-enable */
            var override = {safeApply:safeApply};
            angular.extend(_authUtils_, override);

        }));
        describe('Exists', function() {
            var InstagramService;
            beforeEach(inject(function(_InstagramService_) {
                InstagramService = _InstagramService_;
            }));
            it('should be registered', function() {
                expect(InstagramService).not.toEqual(null);
            });
        });

        describe('api methods', function() {
            var InstagramService;
            beforeEach(inject(function(_InstagramService_) {
                InstagramService = _InstagramService_;
            }));
            it('should exist', function() {
                expect(InstagramService.getRecent).not.toEqual(null);
                expect(InstagramService.getRecent).toEqual(jasmine.any(Function));
            });
        });

        describe('http calls', function() {
            var InstagramService,
            $httpBackend,
            $httpParamSerializer,
            store,
            url,
            $rootScope;
            function createURL(settings, config){
                config = config || {access_token$: 'WEBTASK_WILL_REPLACE_ME',
                                    webtask_no_cache: 1};
                var params = angular.extend(
                                {},                                 // So we don't pollute the objects
                                config,                             // api_key and format
                                settings || {}                      // method etc.
                            );
                return webtask + '?' + $httpParamSerializer(params);
            }

            beforeEach(inject(function(_InstagramService_, _$httpBackend_, _store_, _$rootScope_,  _$httpParamSerializer_) {
                InstagramService = _InstagramService_;
                $httpBackend = _$httpBackend_;
                $httpParamSerializer = _$httpParamSerializer_;
                store = _store_;
                $rootScope = _$rootScope_;
                store.set('token', token);

                $httpBackend.whenPOST(url)
                    .respond({data:{meta: {code:200},data:[1,2,3,4,5,6]}});

            }));
            afterEach(function() {
                $httpBackend.verifyNoOutstandingRequest();
            });
            it('should return data', function() {
                // store.set('token', token);
                var data;

                InstagramService.getRecent(webtask, {limit:6}).then(function(response) {
                    data = response;
                });
                $httpBackend.flush();
                expect(data).toEqual(jasmine.any(Array));
            });
            it('should return 6 items', function() {
                var data;

                InstagramService.getRecent(webtask, {limit:6}).then(function(response) {
                    data = response;
                });
                $httpBackend.flush();
                expect(data.length).toEqual(6);
            });
        });

        describe('handle no token', function() {
            var InstagramService,
                store,
                $rootScope;
            beforeEach(inject(function(_InstagramService_, _store_, _$rootScope_,  _$httpParamSerializer_) {
                InstagramService = _InstagramService_;
                store = _store_;
                $rootScope = _$rootScope_;

            }));
            it('should reject when no id token', function() {
                store.set('token', null);
                var handler = jasmine.createSpy('error');
                InstagramService.getRecent(webtask, {limit:6}).then(angular.noop, handler);
                $rootScope.$digest(); // Need this!
                expect(handler).toHaveBeenCalledWith({status:500, statusText:'No id token...'});
            });

            it('should reject when no proxy url', function() {
                store.set('token', token);
                var handler = jasmine.createSpy('error');
                InstagramService.getRecent(null, {limit:6}).then(angular.noop, handler);
                $rootScope.$digest(); // Need this!
                expect(handler).toHaveBeenCalledWith({status:500, statusText:'No api urls provided...'});
            });
        });
    });
}());
