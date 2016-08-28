(function (angular) {
    'use strict';

    angular.module('ci-site').service('usefulLinksService', UsefulLinksService);

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
