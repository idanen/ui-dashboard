(function (angular) {
    'use strict';

    angular
        .module('ui')
        .controller('WidgetCtrl', WidgetController);

    WidgetController.$inject = ['widget'];
    function WidgetController(widget) {
        this.widget = widget;
    }
}(window.angular));
