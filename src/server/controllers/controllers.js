var Promise = require('promise');
var eRequest = require('request');
exports.UIDashboardController = function () {
    var resultJobs = [];
    var currentJob;
    var fs = require('fs');
    var dealArr;
    var DATA_LOCATION = 'src/server/resources/test.json';
    var JENKINS_JOB_URL = 'http://mydtbld0021.hpeswlab.net:8080/jenkins/job/';
    var FIREBASE_URL_CI_JOBS = 'https://boiling-inferno-9766.firebaseio.com/allJobs';
    var FIREBASE_REST_SUFFIX = '.json';
    var StatusUpdater = require('../services/status-updater.js');
    var updater = new StatusUpdater(1000 * 10);
    return {

        save: function (req, res) {
            var dataToSave = JSON.stringify(req.body);
            fs.writeFile(DATA_LOCATION, dataToSave, 'utf8', function (err) {
                if (err) {
                    res.send(err);
                } else {
                    res.send('OK');
                }
            });
        },

        load: function (req, res) {
            fs.readFile(DATA_LOCATION, 'utf8', function (err, fileContent) {

                if (err) {
                    res.send(err);
                    return console.log("Error controllers 27: " + err);
                }

                res.send(JSON.parse(fileContent));
            });
        },


        addNewJob: function (request, res) {
            var job = request.body;
            var tmpJson = JSON.stringify(job);
            // apply first validation , job name exists in Jenkins
            eRequest.get(JENKINS_JOB_URL + job.name + '/lastBuild/api/json',
                function(error, response, body) {
                    if(response.statusCode == 404){ // if not exist return error
                        res.send("3");
                    }else{
                        // apply second validation , check if job already exists in the DB
                        eRequest.get(buildFirebaseURL(), function(error, response, body) {
                            var jobsObj = JSON.parse(body),
                                jobsArr = Object.keys(jobsObj).map(function(k) {
                                    return jobsObj[k];
                                });
                            var jobExistInDB = checkJobExistInDB(jobsArr, job.name);
                            if(jobExistInDB == true){ // calling a function that search if job exists in the array
                                // if its not duplicated , add the job to DB
                                eRequest.patch({
                                    headers: {'content-type': 'application/json'},
                                    url: buildFirebaseURL(job.name),
                                    body: tmpJson
                                }, function (error, response, body) {
                                    if(error){
                                        res.send("1");
                                    }else{
                                        res.send("0");
                                    }
                                });
                            }else{
                                res.send("2");
                            }
                        });
                    }
                });
        },

        updateJob: function (request, res) {
            var job = request.body;
            delete job.result;
            delete job.building;
            var tmpJson = JSON.stringify(job);
            // using 'patch' to overwrite only required fields
            eRequest.patch({
                headers: {'content-type': 'application/json'},
                url: buildFirebaseURL(job.name),
                body: tmpJson
            }, function (error, response, body) {
                res.send("success");
            });


        },

        getAllJobs: function (req, res) {
            getJobsFromDatabase()
                .then(getJobsStatus)
                .then(function (jobsWithStatuses) {
                    res.send(jobsWithStatuses);
                })
                .catch(function (err) {
                    res.send(err);
                });
        },

        startUpdating: function () {
            updater.getBuildState({name: 'MaaS-SAW-USB-master'});
        }
    };

    // get the job list from the DB ('filter' unused for now)
    function getJobsFromDatabase(filter) {
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
    }
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
                        resolveJob(job);
                    });
                });
                promises.push(jobPromise);
            });
            Promise.all(promises).then(function (jobsWithStatuses) {
                resolve(jobsWithStatuses);
            });
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

};
