(function(){
    'use strict';

    angular
        .module('instagram')
        .controller('PhotosController', PhotosController)
        .controller('ModalController', ModalController);

    function PhotosController(auth, $state, store, InstagramService, $log, toastr, Popeye, webtask) {
        var vm = this,
            imageCount = 6;

        vm.openModal = openModal;
        vm.photos = [];

        if(auth.isAuthenticated){
            vm.user = auth.profile && auth.profile.name;
            loadRecent();
        } else {
            auth.signout();
            store.remove('profile');
            store.remove('token');
            return;
        }

        function loadRecent(){
            InstagramService
                .getRecent(webtask.api, {count:imageCount})
                .then(function(response){
                    vm.photos = response;
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
                    // $log.info('Modal closed');
                });
        }

    }

    function ModalController(img) {
        var vm = this;
        vm.img = img;
    }
}());
