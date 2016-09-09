(function() {
    'use strict';

    describe('component navbar', function() {

    var el;

    beforeEach(module('instagram'));
    beforeEach(inject(function($compile, $rootScope) {

        el = angular.element('<navbar></navbar>');

        $compile(el)($rootScope.$new());
        $rootScope.$digest();

    }));

    it('should be compiled', function() {
        expect(el.html()).not.toEqual(null);
    });


});
}());
