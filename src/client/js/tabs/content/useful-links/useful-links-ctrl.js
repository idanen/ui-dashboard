(function () {
    'use strict';

    angular.module('ci-site').controller('UsefulLinksCtrl', UsefulLinksController);

    UsefulLinksController.$inject = ['usefulLinksService'];

    function UsefulLinksController(usefulLinksService) {
        this.usefulLinksService = usefulLinksService;

        this.loading = false;
        this.links = [];
        this.newLink = {
            name: '',
            href: ''
        };

        this.filter = '';

        this.loadLinks();
    }

    UsefulLinksController.prototype = {
        loadLinks: function () {
            this.loading = true;
            this.links = this.usefulLinksService.getLinks();

            this.links.$loaded()
                .finally(() => this.loading = false);
        },
        add: function () {
            if (this.newLink) {
                this.links.$add(this.newLink).then((function () {
                    this.newLink = {
                        name: '',
                        href: ''
                    };
                }).bind(this));
            }
        },
        deleteLink: function (toDelete) {
            let linkIdx = this.links.$indexFor(toDelete.$id);
            if (linkIdx) {
                this.links.$remove(linkIdx);
            }
        }
    };
})();
