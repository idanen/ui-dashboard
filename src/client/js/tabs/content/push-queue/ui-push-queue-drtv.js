(function (angular) {
    'use strict';

    angular.module('ci-site')
        .directive('uiPushQueue', function () {
            return {
                restrict: 'E',
                controllerAs: 'pushQueueCtrl',
                controller: 'PushQueueCtrl',
                templateUrl: 'js/tabs/content/push-queue/ui-push-queue-tmpl.html'
            };
        });
})(window.angular);
