(function (angular) {
    'use strict';

    angular.module('tabs').service('UsefulLinksService', UsefulLinksService);

    UsefulLinksService.$inject = ['FirebaseService'];

    function UsefulLinksService(FirebaseService) {
        this.links = FirebaseService.getLinks();
    }

    UsefulLinksService.prototype = {
        getLinks: function () {
            return this.links;
        },
        addLink: function (toAdd) {
            this.links.$add(toAdd);
        }
    };
})(window.angular);
