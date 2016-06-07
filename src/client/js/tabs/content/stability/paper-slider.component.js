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

  PaperSliderCtrl.$inject = ['$element', '$scope'];
  function PaperSliderCtrl($element, $scope) {
    this.$element = $element;
    this.$scope = $scope;
  }

  PaperSliderCtrl.prototype = {
    $postLink: function () {
      this.$element[0].addEventListener('value-change', () => {
        if (this.$element[0].value !== this.bindFrom) {
          // This is a regular DOM event so we have to manually trigger change detection (a $digest loop)
          this.$scope.$applyAsync(() => {
            this.onUpdate({
              value: this.$element[0].value
            });
          });
        }
      });
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
