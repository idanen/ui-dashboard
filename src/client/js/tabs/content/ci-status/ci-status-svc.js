/**
 * Created by matarfa on 15/07/2015.
 */


'use strict';

angular.module('tabs').service('CiStatusService', ['$http',function ($http) {
    this.invalidateHead = function() {
        return 3;
    };
}]);



angular.module('tabs').controller('ciStatusController',['$scope','$http','$interval', function($scope,$http,$interval){
    $scope.warning="";
    $scope.nameJson =[];
    $scope.btnStyle="btn btn-default";
    $scope.animateOnUpdate = "fadeOut"; // ng-class fading for refreshing data
    $scope.progressBarStatus = true;
    $scope.progBarWidth = "width:20%";
    $scope.progBarCurStatus = "Loading.. (20%)";
    $scope.progBarValue = 20;
    $scope.dataDismiss = " ";
    $scope.validateForm = false;
    $scope.addJobFormSendBtn = "btn btn-default";
    $scope.addJobResultButtonValue = "Add";
    $scope.validationErrorMessage;
  /* // Update Jobs Each 5 Seconds
    $interval(function(){
        if($scope.runEachSeconds == true){
            $interval($scope.addJob({name:"MaaS-Platf-UI-Branch-master"}),5000);
        }
    },1000);
*/
    var progressBarStatus = $interval(function() {
        $scope.progBarWidth = "width:" + $scope.progBarValue + "%";
        $scope.progBarCurStatus = "Loading.. (" + $scope.progBarValue + "%)";
        $scope.progBarValue += 10;
        if($scope.progBarValue == 100){
            $scope.stopProgressBar();
        }
    }, 700);

    $scope.stopProgressBar = function(){
        $interval.cancel(progressBarStatus);
        $scope.progressBarStatus = false;
    };

    // Load All Jobs From The Server - Push Result Into $scope.nameJson array.
    $scope.loadJobs = function(){
        $http.get("//localhost:4000/loadJobs")
            .success(function(res){
                $scope.nameJson =  res;
                $scope.animateOnUpdate = "fadeIn";
                $scope.stopProgressBar();
            });
    };

    // Refresh Jobs List
    $scope.updateAllJobs = function(){
        $scope.animateOnUpdate = "fadeOut";
        $scope.loadJobs();
    };

    // Add New Job - Server add job to Firebase.
    $scope.addJob = function(job) {
        if($scope.addJobResultButtonValue == "Done"){
            $scope.addJobFormSendBtn = "btn btn-default";
            $scope.addJobResultButtonValue = "Add";
            return;
        }
        var newJob = {name:job.name,alias:job.alias,freeze:{
            state:false,
            onStyle:'btn btn-default',
            offStyle:'btn btn-primary'
        }};
        $http.post("//localhost:4000/addJob", newJob) // to check if build exist
            .success(function (res) {
                if(res == "3") {
                    $scope.validateForm = true;
                    $scope.validationErrorMessage="Invalid name: Job name required as in Jenkins";
                }else if(res == "2") {
                    $scope.validateForm = true;
                    $scope.validationErrorMessage="Job Already Exists..";
                }else if(res == "1"){
                    $scope.validateForm = true;
                    $scope.validationErrorMessage="Connection Problem , please try again..";
                }else {
                    $scope.validateForm = false;
                    $scope.dataDismiss = "modal";
                    $scope.addJobFormSendBtn = "btn btn-success";
                    $scope.addJobResultButtonValue = "Done";
                    $scope.updateAllJobs();
                }
            }
        );
    };


    $scope.displayName = function(job){
        if(job.alias != "" && job.alias !== undefined){
            return job.alias;
        }else{
            return job.name;
        }
    };

    // for json and http use
    $scope.status = function(job){
        if(job.building == true){
            return "Running";
        }else{
            return job.result;
        }
    };

    $scope.chooseImg = function(job){
        if(job.building == true){
            return "../images/green_anime.gif";
        }else{
            return "../images/" + job.result + ".png";
        }
    };

    // for json and http
    $scope.trStatus = function(job) {
        if (job.building == true) {
            return "active";
        } else {
            if (job.result == "SUCCESS") {
                return "success";
            } else if (job.result == "FAILURE") {
                return "danger";
            } else if (job.result == "UNSTABLE") {
                return "warning";
            }
        }
    };

    $scope.styleJobRow = function(job){
        return $scope.trStatus(job) + " " + $scope.animateOnUpdate;
    }

    $scope.toggleFreeze = function (job,btnType) {
        if( (btnType === 'onButton' && job.freeze.state === false) || // toggle if need to
            (btnType === 'offButton' && job.freeze.state === true)){
            job.freeze.state = !job.freeze.state;
            console.log("toggling");
            if (job.freeze.onStyle == "btn btn-default") {
                job.freeze.onStyle = "btn btn-primary";
                job.freeze.offStyle = "btn btn-default";
            } else {
                job.freeze.offStyle = "btn btn-primary";
                job.freeze.onStyle = "btn btn-default";
            }
            console.log("apply it to DB");
            $http.post("//localhost:4000/updateJob", job) // to check if build exist
                .success(function (res) {
                    console.log("toggled successfully");
                }
            );
        }
    };
}]);



/**
 * Filters out all duplicate items from an array by checking the specified key
 * @param [key] {string} the name of the attribute of each object to compare for uniqueness
 if the key is empty, the entire object will be compared
 if the key === false then no filtering will be performed
 * @return {array}
 */
angular.module('tabs').filter('unique', function () {

    return function (items, filterOn) {

        if (filterOn === false) {
            return items;
        }

        if ((filterOn || angular.isUndefined(filterOn)) && angular.isArray(items)) {
            var hashCheck = {}, newItems = [];

            var extractValueToCompare = function (item) {
                if (angular.isObject(item) && angular.isString(filterOn)) {
                    return item[filterOn];
                } else {
                    return item;
                }
            };

            angular.forEach(items, function (item) {
                var valueToCheck, isDuplicate = false;

                for (var i = 0; i < newItems.length; i++) {
                    if (angular.equals(extractValueToCompare(newItems[i]), extractValueToCompare(item))) {
                        isDuplicate = true;
                        break;
                    }
                }
                if (!isDuplicate) {
                    newItems.push(item);
                }

            });
            items = newItems;
        }
        return items;
    };
});

