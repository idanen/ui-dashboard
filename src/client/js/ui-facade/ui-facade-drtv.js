(function (angular) {
    'use strict';

    angular.module('ui').directive('uiFacade', ['RegisteredTabsList', function (RegisteredTabsList) {
        return {
            restrict: 'E',
            templateUrl: '/js/ui-facade/ui-facade-tmpl.html',
            link: function (scope) {

                scope.appplySelectedTabContent = function applySelectedTabContent(tabId) {
                    var tabUrlContent = RegisteredTabsList.getTabContent(tabId);
                    scope.selectedTabContent = tabUrlContent;
                };
            }
        };
    }]);
})(window.angular);
