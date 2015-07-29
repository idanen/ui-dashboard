var Promise = require('promise');
var eRequest = require('request');
exports.UIDashboardController = function () {
    var resultJobs = [];
    var currentJob;
    var fs = require('fs');
    var dealArr;
    var DATA_LOCATION = 'src/server/resources/test.json';
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
            eRequest.get("http://mydtbld0021.isr.hp.com:8080/jenkins/job/" + job.name + "/lastBuild/api/json",
                function(error, response, body) {
                    if(response.statusCode == 404){
                        res.send("3");
                    }else{
                        eRequest.get("http://boiling-inferno-9766.firebaseio.com/allJobs.json", function(error, response, body) {
                            var jobsObj = JSON.parse(body),
                                jobsArr = Object.keys(jobsObj).map(function(k) {
                                    return jobsObj[k];
                                });
                            if(checkJobExistInDB(jobsArr,job.name) == false){
                                eRequest.patch({
                                    headers: {'content-type': 'application/json'},
                                    url: 'https://boiling-inferno-9766.firebaseio.com/allJobs/' + job.name + '.json',
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
            var tmpJson = JSON.stringify(job);
            delete tmpJson.result;
            delete tmpJson.building;
            eRequest.patch({
                headers: {'content-type': 'application/json'},
                url: 'https://boiling-inferno-9766.firebaseio.com/allJobs/' + job.name + '.json',
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
        }
    };

    function getJobsFromDatabase(filter) {
        return new Promise(function (resolve, reject) {
            eRequest.get("http://boiling-inferno-9766.firebaseio.com/allJobs.json", function(error, response, body) {
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

    function getJobsStatus(jobs) {
        return new Promise(function (resolve, reject) {
            var promises = [];
            jobs.forEach(function (job) {
                var jobPromise = new Promise(function getJobStatus(resolveJob, rejectJob) {
                    var jenkinsUrl = "http://mydtbld0021.isr.hp.com:8080/jenkins/job/" + job.name + "/lastBuild/api/json";
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
    };


    function addJobToDB(job){
        return new Promise(function (resolve, reject) {
            eRequest.patch({
                headers: {'content-type': 'application/json'},
                url: 'https://boiling-inferno-9766.firebaseio.com/allJobs/' + job.name + '.json',
                body: job
            }, function (error, response, body) {
                res.send("success");
                resolve("done");
            });
        });
    };

    function checkJobExistInDB(jobsArray,searchedJobName){
        jobsArray.forEach(function(job){
            if(job.name == searchedJobName){
                return false;
            }
        });
        return true;
    };

};
