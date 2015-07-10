
'use strict';

angular.module('tabs').directive('uiTabNavigationHeader', ['RegisteredTabsList', function (RegisteredTabsList) {
    return {
        restrict: 'E',
        templateUrl: 'js/tabs/list/ui-tab-navigation-header-tmpl.html',
        link: function (scope) {

            scope.tabNavigationHeader = RegisteredTabsList.getTabDisplay(scope.tabId);

            // if this is the first tab - make it active
            if (scope.$index === 0) {

                // the element is not yet interpolated here, by now, from some reason
                scope.$applyAsync(function () {
                    scope.selectTab(0, scope.tabId);
                });
            }
        }
    };
}]);