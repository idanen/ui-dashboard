(function () {
    'use strict';

    angular.module('tabs').controller('UsefulLinksCtrl', UsefulLinksController);

    UsefulLinksController.$inject = ['UsefulLinksService'];

    function UsefulLinksController(UsefulLinksService) {
        this.links = UsefulLinksService.getLinks();
        this.newLink = {
            name: '',
            href: ''
        };

        this.filter = '';
    }

    UsefulLinksController.prototype = {
        add: function () {
            if (this.newLink) {
                this.links.$add(this.newLink).then((function () {
                    this.newLink = {
                        name: '',
                        href: ''
                    };
                }).bind(this));
            }
        }
    };
})();
