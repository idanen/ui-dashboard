(function (angular) {
    'use strict';

    angular.module('tabs').service('ShoutOutsService', ShoutOutsService).constant('SHOUT_TITLE', 'Shout Out!');

    ShoutOutsService.$inject = ['FirebaseService', 'NotificationService', 'SHOUT_TITLE'];

    function ShoutOutsService(FirebaseService, NotificationService, SHOUT_TITLE) {
        var svc = this;
        svc.shoutouts = FirebaseService.getShoutOuts();
        svc.notifier = NotificationService;
        svc.title = SHOUT_TITLE;

        svc.shoutouts.$loaded(function () {
            svc.shoutouts.$watch(function (event) {
                if (event.event === 'child_added') {
                    if (svc.shoutouts.length > 0) {
                        svc.shout(svc.shoutouts[svc.shoutouts.length - 1].message);
                    }
                }
            });
        });
    }

    ShoutOutsService.prototype = {
        addShout: function (messageToShout) {
            this.shoutouts.$add({
                message: messageToShout,
                shoutedAt: Date.now()
            });
        },
        shout: function (toShout) {
            this.notifier.notify(toShout, this.title, '/images/shoutout-icon-orange-125x125.png', 'ShoutOutsNotification', 10000);
        }
    };
})(window.angular);
