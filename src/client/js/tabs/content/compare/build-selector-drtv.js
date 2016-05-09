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
      this.name = this.selected && this.selected.name;
      this.number = this.selected && this.selected.number;
      //this.buildResults = _.find(this.builds, {$id: this.name}).builds;
      this.buildResults = [];
    },
    $onChanges: function (changes) {
      if (changes.selected) {
        if (changes.selected.currentValue.name) {
          this.name = changes.selected.currentValue.name;
          this.buildResults = _.find(this.builds, {$id: this.name}).builds;
        }
        if (changes.selected.currentValue.number) {
          this.number = changes.selected.currentValue.number;
        }
      }
      if (changes.builds && changes.builds.currentValue) {
        let buildId = changes.builds.currentValue[0].$id,
            buildNumber = Object.keys(changes.builds.currentValue[buildId].builds)[0];
        this.name = buildId;
        this.number = buildNumber;
      }
    },
    $postLink: angular.noop,
    $onDestroy: angular.noop,
    selectedName: function () {
      this.onChange({prop: 'name', value: this.name});
      this.buildResults = _.find(this.builds, {$id: this.name}).builds;
    }
  };
}());
