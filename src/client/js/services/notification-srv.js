(function (angular, Notification) {
    'use strict';

    angular.module('tabs').service('NotificationService', ['$timeout', '$window', 'NotificationTags', function ($timeout, $window, NotificationTags) {
        var noNotificationsNotified = false,
            svc = this;

        $window.document.addEventListener('DOMContentLoaded', function () {
            if (Notification.permission !== "granted") {
                Notification.requestPermission();
            }
        });

        svc.notifyQueueChanged = function (nextName, nextImg) {
            return svc.notify(nextName + ' is Next!', 'Push Queue Changed!', nextImg, NotificationTags.PUSH_Q);
        };

        svc.notify = function (message, title, img, tag, closeAfter) {
            if (!Notification && !noNotificationsNotified) {
                alert('Desktop notifications not available in your browser. Try Chrome.');
                noNotificationsNotified = true;
                return;
            }

            if (Notification.permission !== "granted") {
                Notification.requestPermission();
            } else {
                var notification = new Notification(title, {
                    icon: img,
                    body: message,
                    tag: tag
                });

                notification.onclick = function () {
                    $window.focus();
                };

                $timeout(function () {
                    notification.close();
                }, closeAfter || 7000, false);
                // TODO (idan): convert to provider to config default timeout
            }
        };
    }]);
})(window.angular, window.Notification);
