(function () {
  'use strict';

  angular.module('ci-site')
    .service('buildTestsService', BuildTestsService);

  BuildTestsService.$inject = ['$resource', 'ENV'];
  function BuildTestsService($resource, ENV) {
    this.BuildTests = $resource(`${ENV.PROTOCOL}://${ENV.HOST}:${ENV.PORT}/buildTests/:buildName/:buildNumber/:onlyFailed`, {}, {
      specific: {
        method: 'POST',
        isArray: true
      }
    });
    this.LastFailedTests = $resource(`${ENV.PROTOCOL}://${ENV.HOST}:${ENV.PORT}/failedOfLastBuilds/:buildName/:buildCount/:startFromNumber`, {}, {
      specific: {
        method: 'GET',
        isArray: true
      }
    });
    this.Stability = $resource(`${ENV.PROTOCOL}://${ENV.HOST}:${ENV.PORT}/stability/:buildName/:buildCount/:startFromNumber`, {}, {
      query: {
        method: 'GET',
        isArray: true
      }
    });
    this.Compare = $resource(`${ENV.PROTOCOL}://${ENV.HOST}:${ENV.PORT}/compareBuildTests/:buildName/:buildNumber/:toBuildName/:toBuildNumber`, {}, {
      get: {
        method: 'GET',
        isArray: false
      }
    });
  }

  BuildTestsService.prototype = {
    fetch: function (buildName, buildNumber, onlyFailed = true) {
      return this.BuildTests.query({buildName, buildNumber, onlyFailed}).$promise;
    },
    fetchCompare: function (buildName, buildNumber, toBuildName, toBuildNumber) {
      return this.Compare.get({buildName, buildNumber, toBuildName, toBuildNumber}).$promise;
    },
    fetchSpecific: function (buildName, buildNumber, tests) {
      // console.log('sending request to get tests ', tests);
      return this.BuildTests.specific({buildName, buildNumber}, tests).$promise;
    },
    fetchLastFailedOfBuild: function (buildName, startFromNumber, buildCount = 10) {
      return this.LastFailedTests.query({buildName, buildCount, startFromNumber}).$promise;
    },
    getStability: function (buildName, startFromNumber, buildCount = 10, branchName = '') {
      let fetchPromise;
      if (branchName) {
        fetchPromise = this.Stability.query({buildName, buildCount, startFromNumber, branchName}).$promise;
      } else {
        fetchPromise = this.Stability.query({buildName, buildCount, startFromNumber}).$promise;
      }
      return fetchPromise.then(this.addStabilityResultsToTests.bind(this));
    },
    prepareTestsForSending: function (tests) {
      let testsByClass = [];
      tests.forEach((test) => {
        let testByClass = {};
        testByClass.testClass = test.testClassName || test._id && test._id.testClassName;
        testByClass.methods = _.map(test.tests, 'testName');
        testsByClass.push(testByClass);
      });
      return testsByClass;
    },
    addStabilityResultsToTests: function (stabilityResults) {
      return _.reduce(stabilityResults, (testWraps, stabilityResult) => {
        let testWrap = _.find(testWraps, (testWrap) => testWrap.testClassName === stabilityResult._id.testClassName);
        let testData = _.extend(stabilityResult.tests[0], {
          stabilityResult: {
            testName: stabilityResult._id.testName,
            stability: stabilityResult.stability,
            failed: stabilityResult.failed,
            count: stabilityResult.buildIds.length,
            buildIds: _.reverse(_.sortBy(stabilityResult.buildIds, 'buildId'))
          }
        });

        testData.stabilityResult.trends = testData.stabilityResult.buildIds.reduce((trends, buildDetails) => {
          let last = trends[trends.length - 1];
          if (last && last.testFailed === buildDetails.testFailed) {
            last.count += 1;
            last.buildId += ' ' + buildDetails.buildId;
          } else {
            let newSegment = {
              count: 1,
              testFailed: buildDetails.testFailed,
              buildId: '' + buildDetails.buildId
            };
            trends.push(newSegment);
          }

          return trends;
        }, []);

        if (!testWrap) {
          testWraps.push({
            testClassName: stabilityResult._id.testClassName,
            tests: [testData]
          });
        } else {
          testWrap.tests.push(testData);
        }

        return testWraps;
      }, []);
    }
  };
}());
