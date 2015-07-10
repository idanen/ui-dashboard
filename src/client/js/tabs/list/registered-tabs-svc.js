
'use strict';

angular.module('tabs').service('RegisteredTabsList', [function () {

    var registeredTabs = {
        pushQueue: {
            display: 'Push Queue',
            content: 'test1'
        },
        ciStatus: {
            display: 'CI Status',
            content: 'test2'
        }

    };

    this.registerTab = function registerTab(tabHeader, tabTemplateUrl) {
        if (!registeredTabs[tabHeader]) {
            registeredTabs[tabHeader] = tabTemplateUrl;
        }
    };

    this.getTabContent = function(tabName) {
        if (registeredTabs[tabName]) {
            return registeredTabs[tabName].content;
        }
        return undefined;
    };

    this.getTabsNames = function getTabsNames() {
        return _.pluck(_.values(registeredTabs), 'display');
    };

}]);