(function() {
    'use strict';

    angular
        .module('instagram')
        .directive('acmeNavbar', acmeNavbar);

    /** @ngInject */
    function acmeNavbar() {
        var directive = {
          restrict: 'E',
          templateUrl: 'app/components/navbar/navbar.html',
          scope: {

          },
          controller: NavbarController,
          controllerAs: 'vm',
          bindToController: true
        };

        return directive;

        /** @ngInject */
        function NavbarController(auth, store) {
            var vm = this;

            vm.logout = logout;
            vm.auth = auth; // yep, shouldn't do this :-|

            function logout(){
                auth.signout();
                store.remove('profile');
                store.remove('token');
                store.remove('access_token');
            }
        }
    }

}());