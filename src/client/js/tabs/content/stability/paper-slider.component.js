(function () {
  'use strict';

  angular.module('ci-site')
      .component('paperSlider', {
        controller: PaperSliderCtrl,
        bindings: {
          bindFrom: '<',
          onUpdate: '&'
        }
      });

  PaperSliderCtrl.$inject = ['$element'];
  function PaperSliderCtrl($element) {
    this.$element = $element;
  }

  PaperSliderCtrl.prototype = {
    $postLink: function () {
      this.$element[0].addEventListener('value-change', function () {
        this.onUpdate({
          value: this.$element[0].value
        });
      }.bind(this));
    },
    $onChanges: function (changes) {
      if (changes && changes.bindFrom) {
        if ((/^[+\-]?\d+$/).test(changes.bindFrom.currentValue)) {
          this.$element[0].value = parseInt(changes.bindFrom.currentValue, 10);
        } else if ((/^[+\-]?\d*\.\d+$/).test(changes.bindFrom.currentValue)) {
          this.$element[0].value = parseFloat(changes.bindFrom.currentValue);
        }
      }
    }
  };
}());
