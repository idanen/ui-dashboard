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
            }
        ];
        this.widgets = this.UiFacadeService.getWidgets();

        this.currentWidget = this.UiFacadeService.getByIndex(0);
    }

    UiFacadeController.prototype = {
        setCurrent: function (widget) {
            this.currentWidget = widget;
        },
        gotoState: function (widgetId) {
            this.$state.go('widget', { widgetId: widgetId });
            this.setCurrent(this.UiFacadeService.getById(widgetId));
        }
    };
})(window.angular);
