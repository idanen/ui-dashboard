(function () {
    'use strict';

    angular.module('tabs').controller('ShoutOutsCtrl', ShoutOutsController);

    ShoutOutsController.$inject = ['ShoutOutsService'];

    function ShoutOutsController(ShoutOutsService) {
        this.toShout = '';
        this.service = ShoutOutsService;
    }

    ShoutOutsController.prototype = {
        shout: function () {
            this.service.shout(this.toShout);
            this.toShout = '';
        }
    };
})();
