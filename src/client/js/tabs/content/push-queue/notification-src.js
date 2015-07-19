'use strict';

angular.module('tabs').service('NotificationService', [function () {

    document.addEventListener('DOMContentLoaded', function () {
        if (Notification.permission !== "granted")
            Notification.requestPermission();
    });

    this.notifyQueueChanged = function (nextName) {
        if (!Notification) {
            alert('Desktop notifications not available in your browser. Try Chromium.');
            return;
        }

        if (Notification.permission !== "granted")
            Notification.requestPermission();
        else {
            var notification = new Notification('Push Queue Changed!', {
                icon: 'http://www.officialpsds.com/images/thumbs/Thundercats-psd33581.png',
                body: nextName + " is Next!",
            });

            notification.onclick = function () {
                window.open("http://127.0.0.1:3000/index.html#");
            };
        }
    }
}]);
