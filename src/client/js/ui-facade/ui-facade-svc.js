(function (angular, _) {
    'use strict';

    angular.module('ui')
        .service('UiFacadeService', UiFacadeService);

    UiFacadeService.$inject = ['authService', 'userService', '$stateParams'];
    function UiFacadeService(authService, userService, $stateParams) {
        this.authService = authService;
        this.$stateParams = $stateParams;
        this.userService = userService;
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

        this.statesToTitles = {};
        this.widgets.forEach((widget) => this.statesToTitles[widget.id] = widget.title);
        this.statesToTitles.compare = 'Builds Compare';
        this.statesToTitles.stability = 'Build Analysis';
        this.statesToTitles.userprofile = 'User Profile';

        this.currentWidget = this.widgets[0];
    }

    UiFacadeService.prototype = {
        getWidgets: function () {
            return this.widgets;
        },
        getAuthWidgets: function () {
            if (this.userService.isAdmin()) {
                return this.widgets;
            } else {
                return _.filter(this.widgets, (widget) => !widget.requiresAuth || this.userService.isAdmin());
            }
        },
        getStatesNames: function () {
            let allStates = Object.keys(this.statesToTitles),
                authWidgets = this.getAuthWidgets();

            return allStates.filter(state => {
                let isWidget = !!_.find(this.widgets, {id: state});
                let authorized = !!_.find(authWidgets, {id: state});

                return !isWidget || authorized;
            });
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
        getTitleOfState: function (stateName) {
            if (stateName === 'widget') {
                return this.statesToTitles[this.$stateParams.widgetId];
            }
            return this.statesToTitles[stateName];
        },
        getByIndex: function (idx) {
            return this.widgets[idx];
        }
    };
})(window.angular, window._);
