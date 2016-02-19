(function(){
    'use strict';

    angular
        .module('instagram')
        .controller('AboutController', AboutController);

    /** @ngInject */
    function AboutController(webDevTec) {
        var vm = this;
        vm.awesomeThings = [];

        // Page filler...Direct from gulp-angular
        activate();

        function activate() {
            getWebDevTec();
        }

        function getWebDevTec() {
            vm.awesomeThings = webDevTec.getTec();

            angular.forEach(vm.awesomeThings, function(awesomeThing) {
                awesomeThing.rank = Math.random();
            });
        }

    }
}());