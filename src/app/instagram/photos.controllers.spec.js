(function() {
    'use strict';

    describe('controller PhotosController', function(){
        var vm,
            auth,
            $state,
            store,
            InstagramService,
            $httpBackend,
            $rootScope;

        var profile = angular.fromJson('{"picture":"","name":"Mike","nickname":"mikeybyker","counts":{"media":100,"followed_by":100,"follows":100},"clientID":"XXX","updated_at":"2016-02-18T11:41:11.665Z","user_id":"instagram|12345678","identities":[{"access_token":"12345678.9123456.789123456789abc","provider":"instagram","user_id":"12345678","connection":"instagram","isSocial":true}],"created_at":"2016-02-15T16:49:05.573Z","global_client_id":"YYYYY"}');
        var token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoiTWlrZSBEb3JhbiIsImlzcyI6Imh0dHBzOi8vc2luaXN0ZXJ3YWx0ei5ldS5hdXRoMC5jb20vIiwic3ViIjoiaW5zdGFncmFtfDE0NDAwNzk3MjUiLCJhdWQiOiJwVWJCanM0ckZJY3NNeUxaR3V0TFoyVHo2NEg1cVFPMCIsImV4cCI6MTQ1NTgzMTY3MSwiaWF0IjoxNDU1Nzk1NjcxfQ.bwmkzz2ucU-pl63IsjEQDJgygak1VMloKLsrLGF9GvQ';
        var access_token = '123';

        beforeEach(module('instagram'));
        beforeEach(inject(function(_$controller_, _auth_, _$state_, _store_, _InstagramService_, _$httpBackend_, _$rootScope_) {        

            auth = _auth_;
            $state = _$state_;
            store = _store_;
            InstagramService = _InstagramService_;
            $httpBackend = _$httpBackend_;
            $rootScope = _$rootScope_;
            store.set('profile', profile);
            store.set('access_token', access_token);

        }));

        describe('authentication user', function(){
            beforeEach(inject(function(_$controller_, _auth_) {        

                // Mock authentication
                auth.authenticate(store.get('profile'), token);
                // loadRecent will be called - so mock it
                $httpBackend.when('JSONP', /https:\/\/api.instagram.com\/v1\/users\/self\/media\/recent\//)
                    .respond({meta: {code:200},data:[1,2,3,4,5,6]});
                var data;

                vm = _$controller_('PhotosController');

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
                auth.signout();
                spyOn($state, 'go'); // before making the controller
                vm = _$controller_('PhotosController');                
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
                expect($state.current.name).toBe('home');
            });
        });

        describe('modal functionality', function(){
            var Popeye;
            beforeEach(inject(function(_$controller_, _Popeye_, _$q_) {
                vm = _$controller_('PhotosController');
                Popeye = _Popeye_;
                var deferred = _$q_.defer();
                deferred.resolve({});
                spyOn(Popeye, 'openModal').and.returnValue({closed : deferred.promise});            
            }));
            it('openModal defined', function() {
                expect(vm.openModal).toBeDefined();
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
