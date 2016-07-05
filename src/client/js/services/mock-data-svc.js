(function () {
  'use strict';

  angular.module('ci-site')
      .service('mockData', MockDataService);

  MockDataService.$inject = ['$window', '$q', 'NAME_GENERATOR_URL', 'IMAGE_GENERATOR_URL'];
  function MockDataService($window, $q, NAME_GENERATOR_URL, IMAGE_GENERATOR_URL) {
    this.$window = $window;
    this.$q = $q;
    this.NAME_GENERATOR_URL = NAME_GENERATOR_URL;
    this.IMAGE_GENERATOR_URL = IMAGE_GENERATOR_URL;
  }

  MockDataService.prototype = {
    getMockName: function () {
      let reqBody = [
        {
          name: 'name',
          type: 'Last Name'
        }
      ];
      return this.$q.resolve(
          this.$window.fetch(this.NAME_GENERATOR_URL, {
            method: 'POST',
            body: JSON.stringify(reqBody)
          })
              .then(response => response.json())
              .then(jsonResponse => `${jsonResponse.name} Anon`)
      );
    },
    getImageUrl: function (identifier) {
      return `${this.IMAGE_GENERATOR_URL}${identifier}?gravatar=yes`;
    },
    getNameAndImg: function () {
      return this.getMockName()
          .then((generatedName) => {
            return {
              displayName: generatedName,
              photoURL: this.getImageUrl(generatedName)
            };
          });
    }
  };
}());
