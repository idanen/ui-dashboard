(function (angular) {
    'use strict';

    angular.module('tabs')
        .directive('uiPushQueue', function () {
            return {
                restrict: 'E',
                controllerAs: 'pushQueueCtrl',
                controller: 'PushQueueCtrl',
                templateUrl: 'js/tabs/content/push-queue/ui-push-queue-tmpl.html'
            };
        });
})(window.angular);
