(function() {
    'use strict';

    describe('controller PhotosController', function(){
        var vm,
            auth,
            $state,
            store,
            InstagramService,
            $httpBackend,
            $rootScope,
            profile = angular.fromJson('{"picture":"","name":"Mike","nickname":"mikeybyker","counts":{"media":100,"followed_by":100,"follows":100},"clientID":"XXX","updated_at":"2016-02-18T11:41:11.665Z","user_id":"instagram|12345678","identities":[{"access_token":"12345678.9123456.789123456789abc","provider":"instagram","user_id":"12345678","connection":"instagram","isSocial":true}],"created_at":"2016-02-15T16:49:05.573Z","global_client_id":"YYYYY"}'),
            token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2p3dC1pZHAuZXhhbXBsZS5jb20iLCJzdWIiOiJtYWlsdG86bWlrZUBleGFtcGxlLmNvbSIsIm5iZiI6MTQ3Mzc1MzE2NCwiZXhwIjoxODUyNDQ0MTY4LCJpYXQiOjE0NzM3NTMxNjQsImp0aSI6ImlkMTIzNDU2IiwidHlwIjoiaHR0cHM6Ly9leGFtcGxlLmNvbS9yZWdpc3RlciJ9.VRnLwZoG7SwTLEMUG0_TBwsSaPR6fdcf_JUuFH6d5OY',
            webtask = 'https://webtask.it.auth0.com/api/run/wt-mikeybyker-gmail_com-0/ext_idp_webtask/call_ext_api';

        beforeEach(module('instagram'));
        beforeEach(inject(function(_$controller_, _$state_, _store_, _InstagramService_, _$httpBackend_, _$rootScope_, _authUtils_) {        

            // auth = _auth_;
            $state = _$state_;
            store = _store_;
            InstagramService = _InstagramService_;
            $httpBackend = _$httpBackend_;
            $rootScope = _$rootScope_;
            store.set('profile', profile);
            store.set('token', null);

            // Mock auth
            auth = {
                isAuthenticated: false,
                profile: null,
                token: null,
                authenticate : function(profile, token){
                    if(profile && token){
                        this.isAuthenticated = true;
                        this.profile = profile;
                        this.token = token;
                    } else {
                        this.isAuthenticated = false;
                        this.profile = null;
                        this.token = null;
                    }
                    return this.isAuthenticated;
                },
                signout : function(){
                    this.isAuthenticated = false;
                    this.profile = null;
                    this.token = null;
                    $state.go('home');
                },
                signin : function(params, success, failure){
                    if(this.authenticate(store.get('profile'), store.get('token'))){
                        success(profile, token);
                    } else {
                        failure('failed login');
                    }                    
                }
            };


            /* eslint-disable */
            // *fix* auth0 error : Very temperamental: why is it happening?! (and it didn't once or twice...)
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
            // var override = {safeApply:safeApply};
            // angular.extend(_authUtils_, override);


        }));

        describe('authentication user', function(){
            beforeEach(inject(function(_$controller_) {        
                // Mock authentication
                auth.authenticate(store.get('profile'), token);
                // loadRecent will be called - so mock it
                $httpBackend.whenPOST(webtask)
                    .respond({data:{meta: {code:200},data:[1,2,3,4,5,6]}});
                var scope = $rootScope.$new();
                vm = _$controller_('PhotosController', {$scope: scope, auth:auth});

            }));

            it('user isAuthenticated', function() {
                expect(auth.isAuthenticated).toBeTruthy();
            });
            it('should have a photos array', function() {
                expect(angular.isArray(vm.photos)).toBeTruthy();
            });
            it('user should be "Mike"', function() {
                expect(vm.user).toBe('Mike');
            });
        });

        describe('unauthentication user', function(){
            beforeEach(inject(function(_$controller_) {
                spyOn($state, 'go'); // before making the controller
                var scope = $rootScope.$new();
                vm = _$controller_('PhotosController', {$scope: scope, auth:auth});                
            }));
            it('user not isAuthenticated', function() {
                expect(auth.isAuthenticated).not.toBeTruthy();
            });
            it('user not defined', function() {
                expect(vm.user).not.toBeDefined();
            });
            it('return home', function() {
                $rootScope.$digest();
                expect($state.go).toHaveBeenCalledWith('home');
            });

            it('be on home page', function() {
                $rootScope.$digest();
                expect($state.current.name).toBe('home');
            });
        });

        describe('modal functionality', function(){
            var Popeye;
            beforeEach(inject(function(_$controller_, _Popeye_, _$q_) {
                var scope = $rootScope.$new(),
                    deferred = _$q_.defer()
                vm = _$controller_('PhotosController', {$scope: scope, auth:auth});
                Popeye = _Popeye_;
                deferred.resolve({});
                spyOn(Popeye, 'openModal').and.returnValue({closed : deferred.promise});            
            }));
            it('openModal defined', function() {
                // expect(vm.openModal).toBeDefined();
                expect(vm.openModal).toEqual(jasmine.any(Function));
            });
            it('Popeye.openModal called', function() {
                vm.openModal({images:{standard_resolution:{url:'www.etc.com'}}});
                expect(Popeye.openModal).toHaveBeenCalled();
            });
            it('Popeye.openModal not called when bad photo data', function() {
                vm.openModal({images:null});
                expect(Popeye.openModal).not.toHaveBeenCalled();
            });
        });

    });
}());
