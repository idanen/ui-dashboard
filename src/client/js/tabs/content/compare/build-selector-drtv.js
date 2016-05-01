(function () {
  'use strict';

  angular.module('tabs')
      .component('buildSelector', {
        controller: BuildSelectorController,
        bindings: {
          builds: '<',
          selected: '<',
          onChange: '&'
        },
        templateUrl: 'js/tabs/content/compare/build-selector-tmpl.html'
      });

  BuildSelectorController.$inject = ['$element'];
  function BuildSelectorController($element) {
    this.$element = $element;
  }

  BuildSelectorController.prototype = {
    $onInit: function () {
      this.name = this.selected.name;
      this.number = this.selected.number;
    },
    $onChanges: function (changes) {
      if (changes.selected && changes.selected.currentValue.name) {
        this.name = changes.selected.currentValue.name;
      }
      if (changes.selected && changes.selected.currentValue.number) {
        this.number = changes.selected.currentValue.number;
      }
      if (changes.builds && changes.builds.currentValue) {
        let buildId = Object.keys(changes.builds.currentValue)[0],
            buildNumber = Object.keys(changes.builds.currentValue[buildId].builds)[0];
        this.name = buildId;
        this.number = buildNumber;
      }
    },
    $postLink: angular.noop,
    $onDestroy: angular.noop
  };
}());
