(function() {
    'use strict';

    describe('controllers AboutController', function(){
        var vm;


        beforeEach(module('instagram'));
        beforeEach(inject(function(_$controller_, _webDevTec_) {
            spyOn(_webDevTec_, 'getTec').and.returnValue([{}, {}, {}, {}, {}]);
            vm = _$controller_('AboutController');
        }));

        it('should define more than 5 awesome things', function() {
            expect(angular.isArray(vm.awesomeThings)).toBeTruthy();
            expect(vm.awesomeThings.length === 5).toBeTruthy();
        });

  });
})();
