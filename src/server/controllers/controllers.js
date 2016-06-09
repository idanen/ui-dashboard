var Promise = require('promise'),
    eRequest = require('request'),
    StatusUpdater = require('../services/status-updater'),
    consts = require('../config/consts'),
    TestsRetriever = require('../services/tests-retriever');

module.exports = (function () {
    'use strict';

    var JENKINS_JOB_URL = 'http://mydtbld0021.hpeswlab.net:8080/jenkins/job/';
    var FIREBASE_URL_CI_JOBS = 'https://boiling-inferno-9766.firebaseio.com/allJobs';
    var FIREBASE_REST_SUFFIX = '.json';

    function UIDashboardController() {
        this.statusUpdater = new StatusUpdater();
        this.testsRetriever = new TestsRetriever(consts.TESTS_MONGO_CONNECTION);
    }

    UIDashboardController.prototype = {

        //getBuildStatus: function (request, response) {
        //    return this.statusUpdater.getBuildStatus(request.params.buildName)
        //        .then(function (statuses) {
        //            response.send(statuses);
        //        })
        //        .catch(this._handleError.bind(this, response));
        //},

        updateStatus: function (request, response) {
          var isHead = request.query && request.query.HEAD === '1';
            return this.statusUpdater.updateBuildStatus(request.body, isHead)
                .then(function () {
                    response.send('thanks');
                })
                .catch(function (error) {
                    console.error(error);
                    response.status(404).send(error.message);
                });
        },

        getBuildTests: function (request, response) {
          var pageSize,
              page;
          if (request.query && request.query.pageSize && (/\d+/g.test(request.query.pageSize))) {
            pageSize = parseInt(request.query.pageSize, 10);
            page = /\d+/g.test(request.query.page) ? parseInt(request.query.page, 10) : 0;
          }
            return this.testsRetriever.fetchFailed(request.params.buildName, parseInt(request.params.buildNumber, 10), request.params.onlyFailed || false, pageSize, page)
                .then(function (tests) {
                    response.send(tests);
                })
                .catch(function (error) {
                  console.error(error);
                    response.status(500).send(error.message);
                });
        },

      getCompareTests: function (request, response) {
        var pageSize,
        page;
        if (request.query && request.query.pageSize && (/\d+/g.test(request.query.pageSize))) {
          pageSize = parseInt(request.query.pageSize, 10);
          page = /\d+/g.test(request.query.page) ? parseInt(request.query.page, 10) : 0;
        }
        return this.testsRetriever.fetchCompare(request.params.buildName,
            parseInt(request.params.buildNumber, 10),
            request.params.toBuildName,
            parseInt(request.params.toBuildNumber, 10),
            pageSize, page)
            .then(function (tests) {
              response.send(tests);
            })
            .catch(function (error) {
              console.error(error);
              response.status(500).send(error.message);
            });
      },

      getSpecificBuildTests: function (request, response) {
        var pageSize,
        page;
        if (request.query && request.query.pageSize && (/\d+/g.test(request.query.pageSize))) {
          pageSize = parseInt(request.query.pageSize, 10);
          page = /\d+/g.test(request.query.page) ? parseInt(request.query.page, 10) : 0;
        }
        return this.testsRetriever.fetchSpecific(request.params.buildName, parseInt(request.params.buildNumber, 10), request.body, pageSize, page)
            .then(function (tests) {
              response.send(tests);
            })
            .catch(function (error) {
              console.error(error);
              response.status(500).send(error.message);
            });
      },

      getTestsStability: function (request, response) {
        return this._handleRequest(request, response, function (req) {
          return this.testsRetriever.fetchStability(req.params.buildName, parseInt(req.params.buildCount, 10), parseInt(req.params.startFromNumber, 10))
        }.bind(this));
      },

      getFailedOfLast: function (request, response) {
        return this._handleRequest(request, response, function () {
          return this.testsRetriever.fetchFailedOfLastBuilds(request.params.buildName, request.params.buildCount, parseInt(request.params.startFromNumber, 10))
        }.bind(this));
      },

        // get the job list from the DB ('filter' unused for now)
        getJobsFromDatabase: function (filter) {
            return new Promise(function (resolve, reject) {
                eRequest.get(buildFirebaseURL(), function(error, response, body) {
                    var jobsObj = JSON.parse(body),
                        jobsArr = Object.keys(jobsObj).map(function(k) {
                            return jobsObj[k];
                        });
                    if (filter) {
                        jobsArr = jobsArr.filter(function (job) {
                            return RegExp('^' + filter, 'i').test(job.name);
                        });
                    }
                    resolve(jobsArr);
                });
            });
        },

      _handleError: function (response, error) {
        console.error(error);
        response.status(error.status || 500).send({
          status: error.status,
          message: error.message
        });
      },

      _handleSuccess: function (response, result) {
        response.send(result);
      },

      _handleRequest: function (request, response, promiseFactory) {
        promiseFactory(request)
            .then(this._handleSuccess.bind(this, response))
            .catch(this._handleError.bind(this, response));
      }
    };

    /*
     job status depending on result and building fields , that we always extract them from Jenkins and not from DB,
     so this function iterate over the jobs list and update their status .
     */
    function getJobsStatus(jobs) {
        return new Promise(function (resolve, reject) {
            var promises = [];
            jobs.forEach(function (job) {
                var jobPromise = new Promise(function getJobStatus(resolveJob, rejectJob) {
                    var jenkinsUrl = JENKINS_JOB_URL + job.name + '/lastBuild/api/json';
                    eRequest.get(jenkinsUrl, function (error, response, body) {
                        var jsonIt = JSON.parse(body);
                        job.result = jsonIt.result;
                        job.building = jsonIt.building;
                        job.number = jsonIt.number;
                        resolveJob(job);
                    });
                });
                promises.push(jobPromise);
            }, this);
            Promise.all(promises).then(function (jobsWithStatuses) {
                resolve(jobsWithStatuses);
            }.bind(this));
        });
    }

// adding given job to the database
    function addJobToDB(job){
        return new Promise(function (resolve, reject) {
            eRequest.patch({
                headers: {'content-type': 'application/json'},
                url: buildFirebaseURL(job.name),
                body: job
            }, function (error, response, body) {
                res.send("success");
                resolve("done");
            });
        });
    }

    /* find if a job exists in jobs array ( for duplication validations)
     jobsArray - array of jobs
     searchedJobName - job name that we search
     */
    function checkJobExistInDB(jobsArray,searchedJobName){
        jobsArray.forEach(function(job){
            if(job.name == searchedJobName){
                return false;
            }
        });
        return true;
    }

    /**
     * Builds a URL to the Firebase REST API
     * @param {string} [jobName] An optional identifier to get specific job instead the whole list
     * @return {string} The resource URL
     */
    function buildFirebaseURL(jobName) {
        return FIREBASE_URL_CI_JOBS + (jobName ? '/' + jobName : '') + FIREBASE_REST_SUFFIX;
    }

    return UIDashboardController;
}());
