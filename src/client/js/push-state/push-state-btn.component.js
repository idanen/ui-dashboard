(function () {
  'use strict';

  angular
    .module('ci-site')
    .component('pushStateBtn', {
      controller: PushStateBtnController,
      template: `<toggle-button state="$ctrl.pushOn" label="Allow push notifications" on-update="$ctrl.updateSubscription(state)"></toggle-button>`
    });

  PushStateBtnController.$inject = ['$element', 'pushState', 'userService'];
  function PushStateBtnController($element, pushState, userService) {
    this.$element = $element;
    this.pushStateSvc = pushState;
    this.userService = userService;

    this.pushOn = false;
  }

  PushStateBtnController.prototype = {
    $postLink: function () {
      var $toggler = this.$element.find('paper-toggle-button');
      this.pushStateSvc.getInitialState()
          .then(subscription => {
            if (!this.pushStateSvc.notificationDenied) {
              $toggler.removeAttr('disabled');
            }

            this.pushOn = subscription && this.pushStateSvc.notificationPermited;
          });
    },

    updateSubscription: function (pushOn) {
      if (pushOn) {
        this.pushOn = true;
        this.pushStateSvc.subscribe()
            .then(this.pushStateSvc.getSubscriptionEndpoint.bind(this.pushStateSvc))
            .then(endpoint => {
              return this.userService.addSubscriptionId(endpoint);
            })
            .catch(error => {
              this.pushOn = false;
              console.error('Failed to subscribe to push: ', error);
            });
      } else {
        this.pushStateSvc.unsubscribe()
            .then(subscriptionEndpoint => {
              this.pushOn = false;
              return this.userService.removeSubscriptionId(subscriptionEndpoint);
            });
      }
    }
  };
}());
