(function (angular) {
    'use strict';

    angular.module('ci-site').service('PushQueueService', PushQueueService);

    PushQueueService.$inject = ['Ref', '$q', '$firebaseObject', '$firebaseArray', 'TeamMembersService', 'FirebaseService', 'NotificationService', 'NotificationTags'];
    function PushQueueService(Ref, $q, $firebaseObject, $firebaseArray, TeamMembersService, FirebaseService, notificationService, NotificationTags) {
        var svc = this;

        svc.Ref = Ref;
        svc.$q = $q;
        svc.$firebaseObject = $firebaseObject;
        svc.$firebaseArray = $firebaseArray;
        svc.notificationService = notificationService;
        svc.NotificationTags = NotificationTags;
        svc.queueRef = Ref.child('queue');
        svc.queue = FirebaseService.getQueue();
        svc.globalConfig = {};
        svc.topPriority = 1;
        Ref.child('config/global').on('value', snapshot => svc.globalConfig = snapshot.val());

        svc.removeFromQueue = removeFromQueue;
        svc.getFirstName = getFirstName;
        svc.getMemberByID = getMemberByID;
        svc.unwatchDataChanges = unwatchDataChanges;

        svc.queueRef.on('child_removed', svc.postDequeue, angular.noop, svc);
        svc.queueRef.on('child_moved', svc.orderChanged, angular.noop, svc);

        function removeFromQueue(member) {
            return svc.queueRef.child(member.$id).remove();
        }

        function getFirstName(memberId) {
            return svc.getMemberByID(memberId).fname;
        }

        function getMemberByID(memberId) {
            return TeamMembersService.getMemberByID(memberId);
        }

        function unwatchDataChanges() {
          svc.queueRef.off('child_removed', svc.postDequeue);
          svc.queueRef.off('child_moved', svc.orderChanged);
        }
    }

    PushQueueService.prototype = {
      getQueue: function () {
        return this.$firebaseArray(this.queueRef);
      },
      /**
       * Adds to queue
       * @param {Object} queueable A person or team that requests to be queued
       */
      addToQueue: function (queueable) {
        // First upgrade other members priority, so that the new will be with lowest
        this.updateAllPriorities()
            .then(this.enqueue.bind(this, queueable));
      },
      updateAllPriorities: function () {
        return this.queueRef
            .orderByKey()
            .once('value', (listSnap) => {
              listSnap.forEach((snap) => {
                let currentPriority = snap.getPriority();
                snap.ref.setPriority(currentPriority + 1);
              });
            });
      },
      enqueue: function (queueable) {
        let toQueue = {};
        toQueue.id = queueable.$id;
        toQueue.name = queueable.fname || queueable.name || queueable.$id;
        if (queueable.img) {
          toQueue.img = queueable.img;
        }
        return this.queueRef.push().setWithPriority(toQueue, 1);
      },
      upgradePriority: function (enqueued) {
        return this.orderChanged()
            .then(topPriority => this.queueRef.child(enqueued.$id).setPriority(topPriority + 1));
      },
      fireNotification: function () {
        this.notificationService.notifyQueueChanged(this.queue[0].name, this.queue[0].img);
      },
      orderChanged: function () {
        return this.$q(resolve => {
          this.queueRef.orderByPriority()
              .limitToLast(1)
              .once('child_added', (queueHeadSnap) => {
                this.topPriority = queueHeadSnap.getPriority() || 1;
                resolve(this.topPriority);
              });
        });
      },
      getTopPriority: function () {
        return this.topPriority;
      },
      postDequeue: function () {
        if (this.queue.length > 0 && !!this.globalConfig[this.NotificationTags.PUSH_Q]) {
          this.fireNotification();
        }
      }
    };
})(window.angular);
