(function (angular) {
    'use strict';

    angular.module('ui')
        .controller('UiFacadeCtrl', UiFacadeController);

    UiFacadeController.$inject = ['$state', '$element', '$firebaseAuth', 'UiFacadeService', 'ciStatusService'];
    function UiFacadeController($state, $element, $firebaseAuth, UiFacadeService, ciStatusService) {
        this.UiFacadeService = UiFacadeService;
        this.$state = $state;
        this.$element = $element;
        this.authObj = $firebaseAuth();

        this.authObj.$onAuthStateChanged(this.initWidgets.bind(this));

        ciStatusService.getDefaultBuild()
            .then((build) => {
              this.defaultBuild = build;
            });
    }

    UiFacadeController.prototype = {
      initWidgets: function (/*currentUser*/) {
        this.widgets = this.UiFacadeService.getAuthWidgets();

        this.currentStateWidget = this.widgets[0];
      },
        setWidgetState: function (widget) {
            this.currentStateWidget = widget;
        },
        gotoState: function (widgetId) {
            this.closeDrawer();
            if (widgetId === 'compare') {
              let buildNumber = parseInt(this.defaultBuild.number, 10),
                  toBuildNumber = buildNumber - 1;

              this.$state.go(widgetId, {
                group: this.defaultBuild.group,
                buildName: this.defaultBuild.name,
                buildNumber: buildNumber,
                toGroup: this.defaultBuild.group,
                toBuildName: this.defaultBuild.name,
                toBuildNumber: toBuildNumber
              });
              return;
            }
            if (widgetId === 'stability') {
                this.$state.go(widgetId, {group: this.defaultBuild.group, buildName: this.defaultBuild.name, buildNumber: this.defaultBuild.number});
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
