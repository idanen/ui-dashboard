(function () {
  'use strict';

  angular.module('ci-site')
      .component('toggleButton', {
        controller: ToggleButtonComponent,
        bindings: {
          state: '<',
          label: '@',
          onUpdate: '&'
        },
        template: `
            <label><paper-toggle-button></paper-toggle-button><span>{{ $ctrl.label }}</span></label>
          `
      });

  ToggleButtonComponent.$inject = ['$element'];
  function ToggleButtonComponent($element) {
    this.$element = $element;
  }

  ToggleButtonComponent.prototype = {
    $onInit: function () {
      this.$element.find('paper-toggle-button')[0].checked = this.state;
    },
    $postLink: function () {
      var $toggler = this.$element.find('paper-toggle-button');
      $toggler.on('iron-change', (ev) => {
        this.onUpdate({state: ev.target.checked});
      });

      this.$element.on('$destroy', () => {
        $toggler.off();
      });
    },
    $onChanges: function (changes) {
      if (changes && changes.state) {
        this.$element.find('paper-toggle-button')[0].checked = changes.state.currentValue;
      }
    }
  };
}());
