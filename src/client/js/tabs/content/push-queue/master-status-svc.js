(function (angular) {
    'use strict';

    angular.module('tabs').service('MasterStatusService', MasterStatusService);

    MasterStatusService.$inject = ['FirebaseService', 'NotificationService', '$filter', 'DATE_FORMAT'];

    function MasterStatusService(FirebaseService, NotificationService, $filter, DATE_FORMAT) {
        var svc = this;
        svc.masterStatus = {};
        FirebaseService.getMaterStatus().then(function (masterStatus) {
            svc.masterStatus = masterStatus;
        });

        svc.getLastUpdateTime = getLastUpdateTime;
        svc.setUpdated = setUpdated;
        svc.masterUpdateNotification = masterUpdateNotification;

        function getLastUpdateTime() {
            return svc.masterStatus.lastUpdateTime || new Date(1970, 0, 1);
        }

        function setUpdated(date) {
            var previousUpdateTime = svc.masterStatus.lastUpdateTime;
            svc.masterStatus.lastUpdateTime = date.getTime();
            svc.masterStatus.$save()
                .then(function() {
                    if (previousUpdateTime !== svc.masterStatus.lastUpdateTime) {
                        svc.masterUpdateNotification(new Date(svc.masterStatus.lastUpdateTime));
                    }
                })
                .catch(function (err) {
                    console.log('Couldn\'t save changes of mater status: ', err);
                });
        }

        function masterUpdateNotification(date) {
            NotificationService.notify('Last update: ' + $filter('date')(date, DATE_FORMAT), 'Team branch merged to master', '/images/git-icon-black.png', 'NotificationTagMasterMerge', 1000 * 60 * 60 * 30);
        }
    }
})(window.angular);
