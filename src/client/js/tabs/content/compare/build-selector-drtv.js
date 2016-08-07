(function () {
  'use strict';

  angular.module('ci-site')
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

  BuildSelectorController.$inject = ['$element', 'DEFAULT_JOB_NAME'];
  function BuildSelectorController($element, DEFAULT_JOB_NAME) {
    this.$element = $element;
    this.DEFAULT_JOB_NAME = DEFAULT_JOB_NAME;
    this.selectedBuildResult = 'UNKNOWN';
  }

  BuildSelectorController.prototype = {
    $onInit: function () {
      this.group = this.selected && this.selected.group;
      this.name = this.selected && this.selected.name;
      this.number = this.selected && this.selected.number;
      this.builds.$loaded().then(() => {
        let selectedBuild = _.find(this.builds, {$id: this.name});
        if (selectedBuild) {
          let buildResult;
          this.buildResults = this.buildResultsData(this.builds, this.name);
          buildResult = _.find(this.buildResults, {id: this.number});
          if (!this.number) {
            this.number = this.buildResults[0].id;
            this.onChange({prop: 'number', value: this.number});
          }
          this.selectedBuildResult = buildResult ? buildResult.result : 'UNKNOWN';
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
          this.getSelectedBuildResult();
        }
      }
      if (changes.builds && changes.builds.currentValue) {
        let firstBuild = changes.builds.currentValue[0],
            masterBuild = _.find(changes.builds.currentValue, { $id: this.DEFAULT_JOB_NAME });
        this.name = firstBuild.$id;
        if (this.group === 'masters' && !!masterBuild) {
          this.name = masterBuild.$id;
        }
        this.buildResults = this.buildResultsData(this.builds, this.name);
        this.number = this.buildResults[0].id;
        this.getSelectedBuildResult();
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
      this.getSelectedBuildResult();
    },
    getSelectedBuildResult: function () {
      let buildResult = _.find(this.buildResults, {id: this.number});
      if (!this.number) {
        this.number = this.buildResults[0].id;
        this.onChange({prop: 'number', value: this.number});
      }
      this.selectedBuildResult = buildResult ? buildResult.result : 'UNKNOWN';
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
