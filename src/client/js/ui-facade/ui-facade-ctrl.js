(function (angular) {
    'use strict';

    angular.module('ui')
        .controller('UiFacadeCtrl', UiFacadeController);

    UiFacadeController.$inject = ['$scope', '$state', '$element', '$firebaseAuth', 'UiFacadeService', 'ciStatusService'];
    function UiFacadeController($scope, $state, $element, $firebaseAuth, facadeService, ciStatusService) {
        this.facadeService = facadeService;
        this.$state = $state;
        this.$element = $element;
        this.authObj = $firebaseAuth();

        this.authObj.$onAuthStateChanged(this.initWidgets.bind(this));

        ciStatusService.getDefaultBuild()
            .then((build) => {
              this.defaultBuild = build;
            });

      $scope.$on('$stateChangeSuccess', (event, toState) => {
        this.title = this.facadeService.getTitleOfState(toState.name);
      });
    }

    UiFacadeController.prototype = {
      initWidgets: function (/*currentUser*/) {
        this.widgets = this.facadeService.getAuthWidgets();

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
            this.setWidgetState(this.facadeService.getById(widgetId));
        },
        setMainWidget: function (index) {
            this.currentWidget = this.mainWidgets[index];
        },
        closeDrawer: function () {
            this.$element.find('paper-drawer-panel')[0].closeDrawer();
        }
    };
})(window.angular);
