(function () {
    'use strict';

    angular.module('tabs').controller('UsefulLinksCtrl', UsefulLinksController);

    function UsefulLinksController() {
        this.links = [
            {
                name: 'Maas Platform API reference',
                href: 'http://myd-vm01227.hpswlabs.adapps.hp.com/api/'
            }
        ];
    }
})();
