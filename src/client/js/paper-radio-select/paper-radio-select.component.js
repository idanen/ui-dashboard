(function () {
  'use strict';

  angular.module('ci-site')
      .component('paperRadioSelect', {
        controller: PaperRadioSelectController,
        bindings: {
          options: '<',
          selection: '<',
          onChange: '&'
        },
        template: `
        <paper-radio-group>
          <paper-radio-button ng-repeat="option in $ctrl.options" name="{{ option.value }}">{{ option.name }}</paper-radio-button>
        </paper-radio-group>
        `
      });

  PaperRadioSelectController.$inject = ['$element', '$window', '$q'];
  function PaperRadioSelectController($element, $window, $q) {
    this.$element = $element;
    this.$window = $window;
    this.$q = $q;
  }

  PaperRadioSelectController.prototype = {
    $postLink() {
      this.$element.on('paper-radio-group-changed', 'paper-radio-group', ev => {
        this.onChange({value: ev.target.selected});
      });

      this.waitForWebComponents()
          .then(() => this.$element.find('paper-radio-group')[0].select(this.selection));
    },

    $onChanges(changes) {
      if (changes.selection && changes.selection.currentValue !== changes.selection.previousValue) {
        this.$element.find('paper-radio-group')[0].select(changes.selection.currentValue);
      }
    },

    $onDestroy() {
      this.$element.off();
    },

    waitForWebComponents: function () {
      return this.$q(resolve => {
        this.$window.addEventListener('WebComponentsReady', () => resolve());
      });
    }
  };
}());
