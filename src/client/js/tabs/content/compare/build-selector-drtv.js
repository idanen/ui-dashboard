(function () {
  'use strict';

  angular.module('tabs')
      .component('buildSelector', {
        controller: BuildSelectorController,
        bindings: {
          groups: '<',
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
      this.group = this.selected && this.selected.group;
      this.name = this.selected && this.selected.name;
      this.number = this.selected && this.selected.number;
      this.builds.$loaded().then(() => {
        let selectedBuild = _.find(this.builds, {$id: this.name});
        if (selectedBuild) {
          this.buildResults = Object.keys(selectedBuild.builds).reverse();
          if (!this.number) {
            this.number = this.buildResults[0];
            this.onChange({prop: 'number', value: this.number});
          }
        }
      });
    },
    $onChanges: function (changes) {
      if (changes.selected && changes.selected.currentValue) {
        if (changes.selected.currentValue.group) {
          this.group = changes.selected.currentValue.group;
        }
        if (changes.selected.currentValue.name) {
          this.name = changes.selected.currentValue.name;
          let selectedBuild = _.find(this.builds, {$id: this.name});
          this.buildResults = Object.keys(selectedBuild.builds).reverse();
        }
        if (changes.selected.currentValue.number) {
          this.number = changes.selected.currentValue.number;
        }
      }
      if (changes.builds && changes.builds.currentValue) {
        let firstBuild = changes.builds.currentValue[0];
        this.name = firstBuild.$id;
        this.buildResults = Object.keys(firstBuild.builds).reverse();
        this.number = this.buildResults[0];
      }
    },
    $postLink: angular.noop,
    $onDestroy: angular.noop,
    change: function (prop, value) {
      this[prop] = value;
      this.onChange({prop: prop, value: value});
    },
    selectedName: function () {
      this.onChange({prop: 'name', value: this.name});
      let selectedBuild = _.find(this.builds, {$id: this.name});
      this.buildResults = Object.keys(selectedBuild.builds).reverse();
    }
  };
}());
