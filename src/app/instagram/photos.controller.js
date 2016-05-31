(function(){
    'use strict';

    angular
        .module('instagram')
        .controller('PhotosController', PhotosController)
        .controller('ModalController', ModalController);

    /** @ngInject */
    function PhotosController(auth, $state, store, InstagramService, $log, toastr, Popeye) {
        var vm = this,
            imageCount = 6;

        vm.loadRecent = loadRecent;
        vm.openModal = openModal;
        vm.photos = [];

        if(auth.isAuthenticated && store.get('access_token')){
            vm.user = auth.profile && auth.profile.name;
            loadRecent();
        } else {
            auth.signout();
            store.remove('profile');
            store.remove('token');
            store.remove('access_token');
            return;
        }


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

        function openModal(photo){

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
                    // $log.info('Model closed');
                });
        }

    }

    function ModalController(img) {
        var vm = this;
        vm.img = img;
    }
}());