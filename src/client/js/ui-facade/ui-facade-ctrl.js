(function (angular) {
    'use strict';

    angular.module('ui')
        .controller('UiFacadeCtrl', UiFacadeController);

    UiFacadeController.$inject = ['$scope', '$state', '$element', 'userService', 'UiFacadeService', 'ciStatusService'];
    function UiFacadeController($scope, $state, $element, userService, facadeService, ciStatusService) {
      this.facadeService = facadeService;
      this.$state = $state;
      this.$element = $element;
      this.userService = userService;

      let offAdminChange = this.userService.onAdminChange(this.initWidgets.bind(this));

      ciStatusService.getDefaultBuild()
          .then((build) => {
            this.defaultBuild = build;
          });

      $scope.$on('$stateChangeSuccess', (event, toState) => {
        this.title = this.facadeService.getTitleOfState(toState.name);
      });

      $scope.$on('$destroy', offAdminChange);
    }

    UiFacadeController.prototype = {
      initWidgets: function (/*currentUser*/) {
        this.otherStates = this.facadeService.getStatesNames();
      },
      getTitleOfState: function (stateName) {
        return this.facadeService.getTitleOfState(stateName);
      },
      paramsForState: function (stateName) {
        switch (stateName) {
          case 'compare':
            let buildNumber = parseInt(this.defaultBuild.number, 10),
                toBuildNumber = buildNumber - 1;

            return {
              group: this.defaultBuild.group,
              buildName: this.defaultBuild.name,
              buildNumber: buildNumber,
              toGroup: this.defaultBuild.group,
              toBuildName: this.defaultBuild.name,
              toBuildNumber: toBuildNumber
            };
          case 'stability':
            return {
              group: this.defaultBuild.group,
              buildName: this.defaultBuild.name,
              buildNumber: this.defaultBuild.number
            };
          case 'userprofile':
            let uid = this.userService.getCurrentUserId();
            return {
              userId: uid
            };
          default:
            return {
              widgetId: stateName
            };
        }
      },
      gotoState: function (stateName) {
          this.closeDrawer();
          if (stateName === 'compare') {
            this.$state.go(stateName, this.paramsForState(stateName));
            return;
          }
          if (stateName === 'stability') {
            this.$state.go(stateName, this.paramsForState(stateName));
            return;
          }
          if (stateName === 'userprofile') {
            this.$state.go(stateName, this.paramsForState(stateName));
            return;
          }
          this.$state.go('widget', { widgetId: stateName });
      },
        setMainWidget: function (index) {
            this.currentWidget = this.mainWidgets[index];
        },
        closeDrawer: function () {
            this.$element.find('paper-drawer-panel')[0].closeDrawer();
        }
    };
})(window.angular);
