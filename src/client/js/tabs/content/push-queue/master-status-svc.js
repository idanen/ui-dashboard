(function (angular) {
    'use strict';

    angular.module('ci-site').service('MasterStatusService', MasterStatusService);

    MasterStatusService.$inject = ['FirebaseService', 'NotificationService', '$filter', 'DATE_FORMAT'];

    function MasterStatusService(FirebaseService, NotificationService, $filter, DATE_FORMAT) {
        var svc = this,
            unwatchMasterChanges, previousUpdateTime;
        svc.masterStatus = {};
        FirebaseService.getMaterStatus().then(function (masterStatus) {
            svc.masterStatus = masterStatus;
            unwatchMasterChanges = svc.masterStatus.$watch(function(ev) {
                // TODO (idan): count watchers to be able to reduce them and unwatch eventually
                console.log("data changed!", ev);
                if (previousUpdateTime !== svc.masterStatus.lastUpdateTime) {
                    svc.masterUpdateNotification(new Date(svc.masterStatus.lastUpdateTime));
                }
            });
        });

        svc.getLastUpdateTime = getLastUpdateTime;
        svc.setUpdated = setUpdated;
        svc.masterUpdateNotification = masterUpdateNotification;
        svc.unwatchDataChanges = unwatchDataChanges;

        function getLastUpdateTime() {
            return svc.masterStatus.lastUpdateTime || new Date(1970, 0, 1);
        }

        function setUpdated(date) {
            previousUpdateTime = svc.masterStatus.lastUpdateTime;
            svc.masterStatus.lastUpdateTime = date.getTime();
            svc.masterStatus.$save()
                .then(function() {
                    console.info('Changes to master status saved successfully');
                })
                .catch(function (err) {
                    console.error('Couldn\'t save changes of mater status: ', err);
                });
        }

        function masterUpdateNotification(date) {
            NotificationService.notify('Last update: ' + $filter('date')(date, DATE_FORMAT), 'Team branch merged to master', '/images/git-icon-black.png', 'NotificationTagMasterMerge', 1000 * 60 * 60 * 30);
        }

        function unwatchDataChanges() {
            // TODO (idan): just reduce watchers count here, call unwatch when all stopped watching
            if (typeof unwatchMasterChanges === 'function') {
                unwatchMasterChanges();
            }
        }
    }
})(window.angular);
