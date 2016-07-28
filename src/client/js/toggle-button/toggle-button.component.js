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
        template: `<paper-toggle-button><span>{{ $ctrl.label }}</span></paper-toggle-button>`
      });

  ToggleButtonComponent.$inject = ['$element'];
  function ToggleButtonComponent($element) {
    this.$element = $element;
  }

  ToggleButtonComponent.prototype = {
    $postLink: function () {
      var $toggler = this.$element.find('paper-toggle-button');
      $toggler[0].checked = this.state;
      $toggler.on('iron-change', (ev) => {
        if (this.state !== ev.target.checked) {
          this.onUpdate({state: ev.target.checked});
        }
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
