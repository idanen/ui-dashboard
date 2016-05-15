(function (angular) {
    'use strict';

    angular.module('ui')
        .controller('UiFacadeCtrl', UiFacadeController);

    UiFacadeController.$inject = ['$state', 'UiFacadeService'];
    function UiFacadeController($state, UiFacadeService) {
        this.UiFacadeService = UiFacadeService;
        this.$state = $state;

        this.mainWidgets = [
            {
                title: 'CI/CD Status',
                contentUrl: 'js/tabs/list/tabs-content-templates/tab-content-ui-ci-status-tmpl.html'
            },
            {
                title: 'Push Queue',
                contentUrl: 'js/tabs/list/tabs-content-templates/tab-content-ui-push-queue-tmpl.html'
            }
        ];
        this.widgets = this.UiFacadeService.getWidgets();

        this.currentWidget = this.mainWidgets[0];
        this.currentStateWidget = this.widgets[0];
    }

    UiFacadeController.prototype = {
        setWidgetState: function (widget) {
            this.currentStateWidget = widget;
        },
        gotoState: function (widgetId) {
            if (widgetId === 'stability') {
                this.$state.go(widgetId);
            }
            this.$state.go('widget', { widgetId: widgetId });
            this.setWidgetState(this.UiFacadeService.getById(widgetId));
        },
        setMainWidget: function (index) {
            this.currentWidget = this.mainWidgets[index];
        }
    };
})(window.angular);
