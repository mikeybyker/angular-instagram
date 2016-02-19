(function() {
    'use strict';

    describe('controllers LoginController', function(){
        var vm;
        var authconfig;


        beforeEach(module('instagram'));
        beforeEach(inject(function(_$controller_, _authconfig_) {
            vm = _$controller_('LoginController');
            authconfig = _authconfig_;
        }));

        it('should have auth0 config', function() {
            expect(authconfig).toBeDefined();
            expect(authconfig.domain).toBeDefined();
        });

        it('should have login function', function() {
            expect(vm.login).toBeDefined();
        });

  });
})();
