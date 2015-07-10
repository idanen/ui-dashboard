
'use strict';

angular.module('tabs').directive('uiTabsList', ['RegisteredTabsList', function (RegisteredTabsList) {
    return {
        restrict: 'E',
        templateUrl: 'js/tabs/list/ui-tabs-list-tmpl.html',
        scope: true,
        link: function (scope, element) {

            var selectedTab = 0;

            scope.tabsNames = RegisteredTabsList.getTabsNames();

            scope.selectTab = function selectTab(tabIndex) {

                var selectedElement = element.find('#item-' + selectedTab);
                selectedElement.removeClass('active');

                selectedTab = tabIndex;

                selectedElement = element.find('#item-' + tabIndex);
                selectedElement.addClass('active');
            };
        }
    };
}]);