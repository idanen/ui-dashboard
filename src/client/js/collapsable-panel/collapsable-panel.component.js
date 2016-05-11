(function () {
  'use strict';

  angular.module('collapsiblePanel', [])
    .component('collapsiblePanel', {
        controller: CollapsiblePanelController,
        bindings: {
          open: '<',
          onCollapseChanged: '&'
        },
        template: `
        <div class="collapsible-panel" ng-class="{'collapsible-panel-open': $ctrl.open}">
          <div class="collapsible-panel-header">
          </div>
          <div class="collapsible-panel-body">
          </div>
        </div>
        `
      });

  function CollapsiblePanelController($element) {
    this.$element = $element;
  }
}());

