(function (angular) {
    'use strict';

    angular.module('ui')
        .directive('uiFacade', ['RegisteredTabsList', function (RegisteredTabsList) {
            return {
                restrict: 'E',
                templateUrl: '/js/ui-facade/ui-facade-tmpl.html',
                controller: 'UiFacadeCtrl',
                controllerAs: 'facade',
                link: function (scope) {

                    scope.appplySelectedTabContent = function applySelectedTabContent(tabId) {
                        var tabUrlContent = RegisteredTabsList.getTabContent(tabId);
                        scope.selectedTabContent = tabUrlContent;
                    };
                }
            };
        }])
        .controller('UiFacadeCtrl', UiFacadeController);

    function UiFacadeController() {
        this.mainWidgets = [
            {
                title: 'Push Queue',
                contentUrl: 'js/tabs/list/tabs-content-templates/tab-content-ui-push-queue-tmpl.html'
            },
            {
                title: 'CI/CD Status',
                contentUrl: 'js/tabs/list/tabs-content-templates/tab-content-ui-ci-status-tmpl.html'
            }
        ];
        this.widgets = [
            {
                title: 'Team Members',
                contentUrl: 'js/tabs/list/tabs-content-templates/tab-content-ui-team-members-tmpl.html',
                columns: 12
            },
            {
                title: 'Useful Links',
                contentUrl: 'js/tabs/list/tabs-content-templates/tab-content-useful-links-tmpl.html',
                columns: 12
            },
            {
                title: 'Shout Outs!',
                subTitle: 'Use \'em wisely',
                contentUrl: 'js/tabs/list/tabs-content-templates/tab-content-shout-outs-tmpl.html',
                columns: 12
            }
        ];

        this.currentWidget = this.widgets[0];
    }

    UiFacadeController.prototype = {
        setCurrent: function (idx) {
            this.currentWidget = this.widgets[idx];
        }
    };
})(window.angular);
