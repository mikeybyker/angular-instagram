(function() {
    'use strict';

    describe('controllers AboutController', function(){
        var vm;

        beforeEach(module('instagram'));
        beforeEach(inject(function(_$controller_, _webDevTec_, _$rootScope_) {
            spyOn(_webDevTec_, 'getTec').and.returnValue([{}, {}, {}, {}, {}]);
            var scope = _$rootScope_.$new();
            vm = _$controller_('AboutController', {$scope: scope});
        }));

        it('should define more than 5 awesome things', function() {
            expect(angular.isArray(vm.awesomeThings)).toBeTruthy();
            expect(vm.awesomeThings.length === 5).toBeTruthy();
        });

  });
})();
