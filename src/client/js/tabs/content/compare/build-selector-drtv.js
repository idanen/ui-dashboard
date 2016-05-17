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
          this.buildResults = this.buildResultsData(this.builds, this.name);
          if (!this.number) {
            this.number = this.buildResults[0].id;
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
          this.buildResults = this.buildResultsData(this.builds, this.name);
        }
        if (changes.selected.currentValue.number) {
          this.number = changes.selected.currentValue.number;
        }
      }
      if (changes.builds && changes.builds.currentValue) {
        let firstBuild = changes.builds.currentValue[0];
        this.name = firstBuild.$id;
        this.buildResults = this.buildResultsData(this.builds, this.name);
        this.number = this.buildResults[0].id;
        this.onChange({prop: 'name', value: this.name});
        this.onChange({prop: 'number', value: this.number});
      }
    },
    $postLink: angular.noop,
    $onDestroy: angular.noop,
    change: function (prop, value) {
      this[prop] = value;
      if (prop === 'name') {
        this.buildResults = this.buildResultsData(this.builds, this.name);
        this.number = this.buildResults[0].id;
        this.onChange({prop: prop, value: value});
        this.onChange({prop: 'number', value: this.number});
      } else {
        this.onChange({prop: prop, value: value});
      }
    },
    buildResultsData: function (builds, selectedName) {
      let buildResults,
          selectedBuild = _.find(builds, {$id: selectedName});
      buildResults = Object.keys(selectedBuild.builds).reverse();
      buildResults = buildResults.map((result) => {
        return {
          id: result,
          result: selectedBuild.builds[result].result,
          branch: selectedBuild.builds[result].branchName
        };
      });
      return buildResults;
    }
  };
}());
