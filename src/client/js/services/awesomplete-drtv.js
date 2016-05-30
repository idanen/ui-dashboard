(function (Awesomplete) {
  'use strict';

  angular.module('ci-site')
    .component('ciAwesomplete', {
        controller: CiAwesompleteController,
        bindings: {
          list: '<',
          selected: '<',
          onChange: '&'
        },
        template: `
          <paper-input-container>
            <label>Build name</label>
            <input class="build-name-selector" is="iron-input"
                   ng-model="$ctrl.value">
          </paper-input-container>
        `
      });

  CiAwesompleteController.$inject = ['$element'];
  function CiAwesompleteController($element) {
    this.$element = $element;
  }

  CiAwesompleteController.prototype = {
    $onInit: function () {
      this.value = '';
    },
    $onChanges: function (changes) {
      if (!this.plugin) {
        this.plugin = new Awesomplete(this.$element[0]);
      }
      if (changes.list && changes.list.currentValue) {
        //this.plugin.list = changes.list.currentValue;
        this.plugin.list = changes.list.currentValue.map((job) => _.extend(job, {label: job.$id, value: job.$id}));
      }
      if (changes.selected) {
        this.value = changes.selected.currentValue;
      }
    },
    $postLink: function () {
      var $input = this.$element.find('input');
      this.plugin = new Awesomplete($input[0]);
      this.list.$loaded()
          .then(() => {
            this.plugin.list = this.list.map((job) => _.extend(job, {label: job.$id, value: job.$id}));
          });
      $input.on('awesomplete-selectcomplete', () => {
        this.value = $input.val();
        this.onChange({value: $input.val()});
      });
    },
    $onDestroy: angular.noop
  };
}(window.Awesomplete));

