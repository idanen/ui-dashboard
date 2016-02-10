(function (angular, _) {
    'use strict';

    angular.module('ui')
        .service('UiFacadeService', UiFacadeService);

    function UiFacadeService() {
        this.widgets = [
            {
                id: 0,
                title: 'Shout Outs!',
                subTitle: 'Use \'em wisely',
                contentUrl: 'js/tabs/list/tabs-content-templates/tab-content-shout-outs-tmpl.html',
                columns: 12
            },
            {
                id: 1,
                title: 'Branch Owners',
                contentUrl: 'js/tabs/list/tabs-content-templates/tab-content-ui-branch-owner-queue-tmpl.html',
                columns: 12
            },
            {
                id: 2,
                title: 'Team Members',
                contentUrl: 'js/tabs/list/tabs-content-templates/tab-content-ui-team-members-tmpl.html',
                columns: 12
            },
            {
                id: 3,
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
