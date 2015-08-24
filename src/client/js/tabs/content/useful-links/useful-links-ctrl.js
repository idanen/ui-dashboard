(function () {
    'use strict';

    angular.module('tabs').controller('UsefulLinksCtrl', UsefulLinksController);

    UsefulLinksController.$inject = ['UsefulLinksService'];

    function UsefulLinksController(UsefulLinksService) {
        this.links = UsefulLinksService.getLinks();

        this.filter = '';
    }
})();
