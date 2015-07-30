(function (angular) {
    'use strict';

    angular.module('ui')
        .directive('uiFacade', ['RegisteredTabsList', function (RegisteredTabsList) {
            return {
                restrict: 'E',
                templateUrl: '/js/ui-facade/ui-facade-tmpl.html',
                controller: 'UiFacadeCtrl',
                controllerAs: 'facade',
                link: function (scope, element) {

                    scope.appplySelectedTabContent = function applySelectedTabContent(tabId) {
                        var tabUrlContent = RegisteredTabsList.getTabContent(tabId);
                        scope.selectedTabContent = tabUrlContent;
                    };
                }
            };
        }])
        .controller('UiFacadeCtrl', UiFacadeController);

    function UiFacadeController() {
        this.widgets = [
            {
                title: 'Push Queue',
                contentUrl: 'js/tabs/list/tabs-content-templates/tab-content-ui-push-queue-tmpl.html',
                columns: 6
            },
            {
                title: 'CI/CD Status',
                contentUrl: 'js/tabs/list/tabs-content-templates/tab-content-ui-team-members-tmpl.html',
                columns: 6
            }
        ];
    }
})(window.angular);
