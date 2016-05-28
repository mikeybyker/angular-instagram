(function() {
    'use strict';

    describe('controller PhotosController', function(){
        var vm,
            auth,
            $state,
            store,
            InstagramService,
            $log,
            toastr,
            $rootScope;

        var profile = angular.fromJson('{"picture":"","name":"Mike","nickname":"mikeybyker","counts":{"media":100,"followed_by":100,"follows":100},"clientID":"XXX","updated_at":"2016-02-18T11:41:11.665Z","user_id":"instagram|12345678","identities":[{"access_token":"12345678.9123456.789123456789abc","provider":"instagram","user_id":"12345678","connection":"instagram","isSocial":true}],"created_at":"2016-02-15T16:49:05.573Z","global_client_id":"YYYYY"}');
        var token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoiTWlrZSBEb3JhbiIsImlzcyI6Imh0dHBzOi8vc2luaXN0ZXJ3YWx0ei5ldS5hdXRoMC5jb20vIiwic3ViIjoiaW5zdGFncmFtfDE0NDAwNzk3MjUiLCJhdWQiOiJwVWJCanM0ckZJY3NNeUxaR3V0TFoyVHo2NEg1cVFPMCIsImV4cCI6MTQ1NTgzMTY3MSwiaWF0IjoxNDU1Nzk1NjcxfQ.bwmkzz2ucU-pl63IsjEQDJgygak1VMloKLsrLGF9GvQ';

        beforeEach(module('instagram'));
        beforeEach(inject(function(_$controller_, _auth_, _$state_, _store_, _InstagramService_, _$log_, _toastr_, _$rootScope_) {        

            auth = _auth_;
            $state = _$state_;
            store = _store_;
            InstagramService = _InstagramService_;
            $log = _$log_;
            toastr = _toastr_;
            $rootScope = _$rootScope_;
            store.set('profile', profile);

        }));

        describe('authentication user', function(){
            beforeEach(inject(function(_$controller_, _auth_) {        

                // Mock authentication
                auth.authenticate(store.get('profile'), token);

                vm = _$controller_('PhotosController');

            }));
            it('user isAuthenticated', function() {
                expect(auth.isAuthenticated).toBeTruthy();
            });
            it('should have a photos array', function() {
                expect(angular.isArray(vm.photos)).toBeTruthy();
            });
            it('user should be "Mike"', function() {
                expect(vm.user).toBe("Mike");
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

    });
}());
