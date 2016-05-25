(function (angular, Notification) {
  'use strict';

  angular
      .module('ci-site')
      .service('NotificationService', NotificationService)
      .run(runFn);

  NotificationService.$inject = ['$q', '$timeout', '$window', 'NotificationTags'];
  function NotificationService($q, $timeout, $window, NotificationTags) {
    this.$q = $q;
    this.$timeout = $timeout;
    this.$window = $window;
    this.NotificationTags = NotificationTags;

    this.allowedByUser = Notification.permission === 'granted';
    this.noNotificationsNotified = false;
  }

  NotificationService.prototype = {
    requestPermission: function () {
      if (Notification.permission !== 'granted') {
        return Notification.requestPermission()
            .then((function (permission) {
              if (permission === 'granted') {
                this.allowedByUser = true;
              }
              return this.allowedByUser;
            }).bind(this));
      }
      return this.$q.when(this.allowedByUser);
    },
    notify: function (message, title, img, tag, closeAfter) {
      if (!Notification && !this.noNotificationsNotified) {
        this.$window.alert('Desktop notifications not available in your browser. Try Chrome.');
        this.noNotificationsNotified = true;
        return false;
      }

      this.requestPermission()
          .then((function (allowed) {
            if (allowed) {
              var notification = new Notification(title, {
                icon: img,
                body: message,
                tag: tag
              });

              notification.onclick = (function () {
                this.$window.focus();
              }).bind(this);

              this.$timeout(function () {
                notification.close();
              }, closeAfter || 7000, false);
              // TODO (idan): convert to provider to config default timeout
            }

            return allowed;
          }).bind(this));

      if (Notification.permission !== "granted") {
        Notification.requestPermission();
      }
    },
    notifyQueueChanged: function (nextName, nextImg) {
      return this.notify(nextName + ' is Next!', 'Push Queue Changed!', nextImg, this.NotificationTags.PUSH_Q);
    }
  };

  runFn.$inject = ['NotificationService'];
  function runFn(NotificationService) {
    NotificationService.requestPermission();
  }
})(window.angular, window.Notification);
