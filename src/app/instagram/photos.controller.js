(function(){
    'use strict';

    angular
        .module('instagram')
        .controller('PhotosController', PhotosController)
        .controller('ModalController', ModalController);

    /** @ngInject */
    function PhotosController(auth, $state, store, InstagramService, $log, toastr, Popeye, webtask) {
        var vm = this,
            imageCount = 6;

        vm.openModal = openModal;
        vm.photos = [];

        if(auth.isAuthenticated){
            vm.user = auth.profile && auth.profile.name;
            loadRecentProxy();
        } else {
            auth.signout();
            store.remove('profile');
            store.remove('token');
            return;
        }


        function loadRecentProxy(){
            InstagramService
                .getRecentProxy(webtask.api, {count:imageCount})
                .then(function(response){
                    // $log.info('loadRecent > Response :::', response);
                    // vm.photos = response.data.data;
                    vm.photos = response; // when returning just the photos array - preferable
                }, function(reason){
                    $log.info('Error :(', reason);
                    var message = angular.isObject(reason) ? reason.statusText : reason;
                    toastr.error('Bit of a problem...<br><strong>' + message + '</strong>');
                });
        }

        function openModal(photo){
            if(!photo.images || !photo.images.standard_resolution){
                return;
            }
            Popeye.openModal({
                    template: '<img src="{{vm.img}}" alt="">',
                    controller: 'ModalController as vm',
                    resolve: {
                        img: function() {
                            return photo.images.standard_resolution.url;
                        }
                    }
                })
                .closed.then(function() {
                    $log.info('Model closed');
                });
        }

    }

    function ModalController(img) {
        var vm = this;
        vm.img = img;
    }
}());

/*

// After auth0 changes, we can't directly access 3rd party APIs (e.g. Instagram)
// Prior to then: 

    function loadRecent(){
        InstagramService
            .getRecent({count:imageCount})
            .then(function(response){
                $log.info('loadRecent > Response :::', response);
                // vm.photos = response.data.data;
                vm.photos = response; // when returning just the photos array - preferable
            }, function(reason){
                $log.info('Error :(', reason);
                var message = angular.isObject(reason) ? reason.statusText : reason;
                toastr.error('Bit of a problem...<br><strong>' + message + '</strong>');
            });
    }

*/