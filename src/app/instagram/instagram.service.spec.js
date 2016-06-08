(function() {
    'use strict';

    describe('service InstagramService', function(){
        var InstagramService,
            $httpBackend,
            store,
            $rootScope;

        beforeEach(module('instagram'));
        beforeEach(inject(function(_InstagramService_, _$httpBackend_, _store_, _$rootScope_) {

            InstagramService = _InstagramService_;
            $httpBackend = _$httpBackend_;
            store = _store_;
            $rootScope = _$rootScope_;

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
                store.set('access_token', '123');
                $httpBackend.when('JSONP', /https:\/\/api.instagram.com\/v1\/users\/self\/media\/recent\//)
                    .respond({meta: {code:200},data:[1,2,3,4,5,6]});
                var data;

                InstagramService.getRecent({limit:6}).then(function(response) {
                    data = response; // Instagram has array (data) inside object data.
                });
                $httpBackend.flush();
                expect(data).toEqual(jasmine.any(Array));
                expect(data.length).toEqual(6);
            });
        });

        describe('handle no access token', function() {
            it('should reject', function() {
                store.set('access_token', null);
                var handler = jasmine.createSpy('error');
                InstagramService.getRecent({limit:6}).then(angular.noop, handler);
                $rootScope.$digest(); // Need this!
                expect(handler).toHaveBeenCalledWith({status:500, statusText:'No access token'});
            });
        });
    });
}());