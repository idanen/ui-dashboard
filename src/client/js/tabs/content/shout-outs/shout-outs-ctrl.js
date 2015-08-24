(function () {
    'use strict';

    angular.module('tabs').controller('ShoutOutsCtrl', ShoutOutsController).constant('SHOUT_TITLE', 'Shout Out!');

    ShoutOutsController.$inject = ['NotificationService', 'SHOUT_TITLE'];

    function ShoutOutsController(NotificationService, SHOUT_TITLE) {
        this.toShout = '';
        this.notifier = NotificationService;
        this.title = SHOUT_TITLE;
    }

    ShoutOutsController.prototype = {
        shout: function () {
            this.notifier.notify(this.toShout, this.title, '/images/shoutout-icon-orange-125x125.png', 'ShoutOutsNotification', 10000);
            this.toShout = '';
        }
    };
})();
