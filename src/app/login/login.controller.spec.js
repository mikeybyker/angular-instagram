(function() {
    'use strict';

    describe('controllers LoginController', function(){
        var vm;
        var auth;
        var $state;
        var store;
        var profile = angular.fromJson('{"picture":"","name":"Mike","nickname":"mikeybyker","counts":{"media":100,"followed_by":100,"follows":100},"clientID":"XXX","updated_at":"2016-02-18T11:41:11.665Z","user_id":"instagram|12345678","identities":[{"access_token":"12345678.9123456.789123456789abc","provider":"instagram","user_id":"12345678","connection":"instagram","isSocial":true}],"created_at":"2016-02-15T16:49:05.573Z","global_client_id":"YYYYY"}');
        // This is expired...
        var tokenExpired = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoiTWlrZSBEb3JhbiIsImlzcyI6Imh0dHBzOi8vc2luaXN0ZXJ3YWx0ei5ldS5hdXRoMC5jb20vIiwic3ViIjoiaW5zdGFncmFtfDE0NDAwNzk3MjUiLCJhdWQiOiJwVWJCanM0ckZJY3NNeUxaR3V0TFoyVHo2NEg1cVFPMCIsImV4cCI6MTQ1NTgzMTY3MSwiaWF0IjoxNDU1Nzk1NjcxfQ.bwmkzz2ucU-pl63IsjEQDJgygak1VMloKLsrLGF9GvQ';
        // This is a year long from 29/05/2016 : So can test with valid JWT...
        var token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL3NpbmlzdGVyd2FsdHouZXUuYXV0aDAuY29tIiwic3ViIjoiaW5zdGFncmFtfDE0NDAwNzk3MjUiLCJuYmYiOjE0NjQ1MTMzNzYsImV4cCI6MTQ5NjA0OTM3NiwiaWF0IjoxNDY0NTEzMzc2LCJqdGkiOiJpZDEyMzQ1NiIsInR5cCI6Imh0dHBzOi8vZXhhbXBsZS5jb20vcmVnaXN0ZXIifQ.NK2Y9FwZQWY1HfkSY81AuYMroP9UvzjmbGtNtCPiamM';
        beforeEach(module('instagram'));
        beforeEach(inject(function(_$controller_, _auth_, _store_, _$state_) {
            vm = _$controller_('LoginController');
            auth = _auth_;
            $state = _$state_;
            store = _store_;
            auth.signout();
            store.remove('profile');
            store.remove('token')
        }));

        it('should have login function', function() {
            expect(vm.login).toBeDefined();
            expect(vm.login).toEqual(jasmine.any(Function));
        });

        it('should login', function() {
            // override the signin method...
            auth.signin = function(params, success, failure){
                auth.authenticate(store.get('profile'), token);
                success(profile, token);
            }
            spyOn($state, 'go');
            vm.login();
            expect(auth.isAuthenticated).toBe(true);
            expect($state.go).toHaveBeenCalledWith('photos');
        });

        it('should stay where we are when fail login', function() {
            // override the signin method...
            auth.signin = function(params, success, failure){
                failure('failed login');
            }
            spyOn($state, 'go');
            vm.login();
            expect(auth.isAuthenticated).toBe(false);
            expect($state.go).not.toHaveBeenCalled();
            
        });

  });
})();
