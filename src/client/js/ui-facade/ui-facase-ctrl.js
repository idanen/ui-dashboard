(function (angular) {
    'use strict';

    angular.module('ui')
        .controller('UiFacadeCtrl', UiFacadeController);

    UiFacadeController.$inject = ['$state', '$element', 'UiFacadeService'];
    function UiFacadeController($state, $element, UiFacadeService) {
        this.UiFacadeService = UiFacadeService;
        this.$state = $state;
        this.$element = $element;

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
        this.widgets = this.UiFacadeService.getAuthWidgets();

        this.currentWidget = this.mainWidgets[0];
        this.currentStateWidget = this.widgets[0];
    }

    UiFacadeController.prototype = {
        setWidgetState: function (widget) {
            this.currentStateWidget = widget;
        },
        gotoState: function (widgetId) {
            this.closeDrawer();
            if (widgetId === 'compare') {
                this.$state.go(widgetId, {group: 'masters', buildName: 'MaaS-SAW-USB-master'});
                return;
            }
            if (widgetId === 'stability') {
                this.$state.go(widgetId);
                return;
            }
            this.$state.go('widget', { widgetId: widgetId });
            this.setWidgetState(this.UiFacadeService.getById(widgetId));
        },
        setMainWidget: function (index) {
            this.currentWidget = this.mainWidgets[index];
        },
        closeDrawer: function () {
            this.$element.find('paper-drawer-panel')[0].closeDrawer();
        }
    };
})(window.angular);
