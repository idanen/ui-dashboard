(function (angular, undefined) {
    'use strict';

    angular.module('ci-site').service('RegisteredTabsList', [function () {

        var registeredTabs = {
            pushQueue: {
                id: 'pushQueue',
                display: 'Push Queue',
                content: 'js/tabs/list/tabs-content-templates/tab-content-ui-push-queue-tmpl.html'
            },
            ciStatus: {
                id: 'ciStatus',
                display: 'CI Status',
                content: 'js/tabs/list/tabs-content-templates/tab-content-ui-ci-status-tmpl.html'
            },
            teamMembers: {
                id: 'teamMembers',
                display: 'Team Members',
                content: 'js/tabs/list/tabs-content-templates/tab-content-ui-team-members-tmpl.html'
            },
            branchOwnerQueue: {
                id: 'branchOwnerQueue',
                display: 'Branch Owners',
                content: 'js/tabs/list/tabs-content-templates/tab-content-ui-branch-owner-queue-tmpl.html'

            }
        };

        this.registerTab = function registerTab(tabHeader, tabTemplateUrl) {
            if (!registeredTabs[tabHeader]) {
                registeredTabs[tabHeader] = tabTemplateUrl;
            }
        };

        this.getTabContent = function (tabId) {
            if (registeredTabs[tabId]) {
                return registeredTabs[tabId].content;
            }
            return undefined;
        };

        this.getTabDisplay = function getTabDisplay(tabId) {
            if (registeredTabs[tabId]) {
                return registeredTabs[tabId].display;
            }
            return undefined;
        };

        this.getTabsIds = function getTabsIds() {
            return Object.keys(registeredTabs);
        };

    }]);
})(window.angular);
