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
            if (this.toShout) {
                this.service.addShout(this.toShout);
                this.toShout = '';
            }
        }
    };
})();
