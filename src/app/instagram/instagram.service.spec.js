(function() {
    'use strict';

    describe('service InstagramService', function(){
        var InstagramService,
            $httpBackend,
            $httpParamSerializer,
            store,
            auth,
            url,
            $rootScope,
            profile = angular.fromJson('{"picture":"","name":"Mike","nickname":"mikeybyker","counts":{"media":100,"followed_by":100,"follows":100},"clientID":"XXX","updated_at":"2016-02-18T11:41:11.665Z","user_id":"instagram|12345678","identities":[{"access_token":"12345678.9123456.789123456789abc","provider":"instagram","user_id":"12345678","connection":"instagram","isSocial":true}],"created_at":"2016-02-15T16:49:05.573Z","global_client_id":"YYYYY"}'),
            token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoiTWlrZSBEb3JhbiIsImlzcyI6Imh0dHBzOi8vc2luaXN0ZXJ3YWx0ei5ldS5hdXRoMC5jb20vIiwic3ViIjoiaW5zdGFncmFtfDE0NDAwNzk3MjUiLCJhdWQiOiJwVWJCanM0ckZJY3NNeUxaR3V0TFoyVHo2NEg1cVFPMCIsImV4cCI6MTQ1NTgzMTY3MSwiaWF0IjoxNDU1Nzk1NjcxfQ.bwmkzz2ucU-pl63IsjEQDJgygak1VMloKLsrLGF9GvQ',
            webtask = 'https://webtask.it.auth0.com/api/run/wt-mikeybyker-gmail_com-0/ext_idp_webtask/call_ext_api';


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

        beforeEach(module('instagram'));
        beforeEach(inject(function(_InstagramService_, _$httpBackend_, _store_, _$rootScope_, _auth_, _$httpParamSerializer_) {

            InstagramService = _InstagramService_;
            $httpBackend = _$httpBackend_;
            $httpParamSerializer = _$httpParamSerializer_;
            store = _store_;
            $rootScope = _$rootScope_;

            auth = _auth_;
            store.set('profile', profile);
            url = createURL({ limit:6 });


        }));


        it('should be registered', function() {
            expect(InstagramService).not.toEqual(null);
        });


        describe('api methods exist', function() {
            it('should exist', function() {
                expect(InstagramService.getRecent).not.toEqual(null);
                expect(InstagramService.getRecent).toEqual(jasmine.any(Function));
            });
        });

        describe('http calls', function() {
            it('should return data', function() {
                store.set('token', token);
                var data;
                
                $httpBackend.whenPOST(url)
                    .respond({data:{meta: {code:200},data:[1,2,3,4,5,6]}});
                InstagramService.getRecent(webtask, {limit:6}).then(function(response) {
                    data = response;
                });
                $httpBackend.flush();
                expect(data).toEqual(jasmine.any(Array));
                expect(data.length).toEqual(6);
                expect([1,2,3,4,5,6].length).toEqual(6);
            });
        });
        describe('handle no token', function() {
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