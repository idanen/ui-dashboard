(function () {
  'use strict';

  angular.module('ci-site')
      .service('mockDate', MockDataService);

  MockDataService.$inject = ['$http', 'MOCKAROO_API_KEY'];
  function MockDataService($http, MOCKAROO_API_KEY) {
    this.$http = $http;
    this.MOCKAROO_API_KEY = MOCKAROO_API_KEY;
  }

  MockDataService.prototype = {
    getMockName: function () {
      return this.$http({
        url: 'http://www.mockaroo.com/api/generate.json',
        data: [
          {
            name: 'name',
            type: 'Full Name'
          }
        ],
        params: {
          key: this.MOCKAROO_API_KEY
        }
      });
    }
  };
}());
