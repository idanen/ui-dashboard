(function (angular, _) {
    'use strict';

    angular.module('ui')
        .service('UiFacadeService', UiFacadeService);

    UiFacadeService.$inject = ['authService'];
    function UiFacadeService(authService) {
        this.authService = authService;
        this.widgets = [
            {
                id: 'cistatus',
                title: 'CI/CD Status',
                contentUrl: 'js/tabs/list/tabs-content-templates/tab-content-ui-ci-status-tmpl.html',
                columns: 12
            },
            {
                id: 'pushqueue',
                title: 'Push Queue',
                contentUrl: 'js/tabs/list/tabs-content-templates/tab-content-ui-push-queue-tmpl.html',
                requiresAuth: true,
                columns: 12
            },
            {
                id: 'shouts',
                title: 'Shout Outs!',
                subTitle: 'Use \'em wisely',
                contentUrl: 'js/tabs/list/tabs-content-templates/tab-content-shout-outs-tmpl.html',
                requiresAuth: true,
                columns: 12
            },
            {
                id: 'branchowners',
                title: 'Branch Owners',
                contentUrl: 'js/tabs/list/tabs-content-templates/tab-content-ui-branch-owner-queue-tmpl.html',
                requiresAuth: true,
                columns: 12
            },
            {
                id: 'members',
                title: 'Team Members',
                contentUrl: 'js/tabs/list/tabs-content-templates/tab-content-ui-team-members-tmpl.html',
                requiresAuth: true,
                columns: 12
            },
            {
                id: 'usefullinks',
                title: 'Useful Links',
                contentUrl: 'js/tabs/list/tabs-content-templates/tab-content-useful-links-tmpl.html',
                columns: 12
            }
        ];

        this.currentWidget = this.widgets[0];
    }

    UiFacadeService.prototype = {
        getWidgets: function () {
            return this.widgets;
        },
        getAuthWidgets: function () {
            if (this.authService.getLoggedUser()) {
                return this.widgets;
            } else {
                return _.filter(this.widgets, (widget) => !widget.requiresAuth);
            }
        },
        setCurrent: function (idx) {
            this.currentWidget = this.widgets[idx];
        },
        getByTitle: function (title) {
            return _.find(this.widgets, { title: title });
        },
        getById: function (id) {
            return _.find(this.widgets, { id: id });
        },
        getByIndex: function (idx) {
            return this.widgets[idx];
        }
    };
})(window.angular, window._);
