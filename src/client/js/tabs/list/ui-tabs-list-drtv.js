
'use strict';

angular.module('tabs').directive('uiTabsList', ['RegisteredTabsList', function (RegisteredTabsList) {
    return {
        restrict: 'E',
        templateUrl: 'js/tabs/list/ui-tabs-list-tmpl.html',
        scope: true,
        link: function (scope, element) {
            scope.tabsNames = RegisteredTabsList.getTabsNames();

        }
    };
}]);