(function() {
    'use strict';

    describe('controllers LoginController', function(){
        var vm,
            auth,
            $state,
            $rootScope,
            store,
            profile = angular.fromJson('{"picture":"","name":"Mike","nickname":"mikeybyker","counts":{"media":100,"followed_by":100,"follows":100},"clientID":"XXX","updated_at":"2016-02-18T11:41:11.665Z","user_id":"instagram|12345678","identities":[{"access_token":"12345678.9123456.789123456789abc","provider":"instagram","user_id":"12345678","connection":"instagram","isSocial":true}],"created_at":"2016-02-15T16:49:05.573Z","global_client_id":"YYYYY"}'),
            // This is expired...
            tokenExpired = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoiTWlrZSBEb3JhbiIsImlzcyI6Imh0dHBzOi8vc2luaXN0ZXJ3YWx0ei5ldS5hdXRoMC5jb20vIiwic3ViIjoiaW5zdGFncmFtfDE0NDAwNzk3MjUiLCJhdWQiOiJwVWJCanM0ckZJY3NNeUxaR3V0TFoyVHo2NEg1cVFPMCIsImV4cCI6MTQ1NTgzMTY3MSwiaWF0IjoxNDU1Nzk1NjcxfQ.bwmkzz2ucU-pl63IsjEQDJgygak1VMloKLsrLGF9GvQ',
            // This is until 2028 : So can test with valid JWT...
            token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL3NpbmlzdGVyd2FsdHouZXUuYXV0aDAuY29tIiwic3ViIjoiaW5zdGFncmFtfDE0NDAwNzk3MjUiLCJuYmYiOjE0NjQ1MTMzNzYsImV4cCI6MTQ5NjA0OTM3NiwiaWF0IjoxNDY0NTEzMzc2LCJqdGkiOiJpZDEyMzQ1NiIsInR5cCI6Imh0dHBzOi8vZXhhbXBsZS5jb20vcmVnaXN0ZXIifQ.NK2Y9FwZQWY1HfkSY81AuYMroP9UvzjmbGtNtCPiamM';

        beforeEach(module('instagram'));
        beforeEach(inject(function(_$controller_, _store_, _$state_, _$rootScope_) {

            $state = _$state_;
            store = _store_;
            $rootScope = _$rootScope_;
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

            var scope = $rootScope.$new();
            vm = _$controller_('LoginController', {$scope: scope, auth: auth});

        }));

        it('should have login function', function() {
            expect(vm.login).toEqual(jasmine.any(Function));
        });

        it('should be authenticated', function() {
            store.set('profile', profile);
            store.set('token', token);
            spyOn($state, 'go');
            vm.login();
            expect(auth.isAuthenticated).toBe(true);
        });

        it('should go to photos page', function() {
            store.set('profile', profile);
            store.set('token', token);
            spyOn($state, 'go');
            vm.login();
            expect($state.go).toHaveBeenCalledWith('photos');
        });

        it('should be unauthenticated', function() {
            store.remove('profile');
            store.remove('token');
            spyOn($state, 'go');
            vm.login();
            expect(auth.isAuthenticated).toBe(false);
        });

        it('should stay where we are when fail login', function() {
            store.remove('profile');
            store.remove('token');
            spyOn($state, 'go');
            vm.login();
            expect($state.go).not.toHaveBeenCalled();
        });

  });
})();
