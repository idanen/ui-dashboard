/**
 * Created by matarfa on 15/07/2015.
 */


'use strict';

angular.module('tabs').service('CiStatusService', ['$http',function ($http) {
    this.invalidateHead = function() {
        return 3;
    };
}]);



angular.module('tabs').controller('ciStatusController',['$scope','$http','$interval', 'ENV', function($scope,$http,$interval, ENV){
    var serviceUrl = `//${ENV.HOST}:${ENV.PORT}`;

    /*******************************
     ********** Variables **********
    *******************************/

    $scope.listOfJobs =[]; // the list of jobs we get from server and use in ng-repeat
    $scope.animateOnUpdate = "fadeOut"; // ng-class fading for refreshing data
    $scope.activeLoader = false; // when it true , progress bar enabled and job list disabled..
    $scope.dataDismiss = " "; // we change it to keep the modal open until response of the server
    $scope.validateForm = false; // control visibility of the Error Message in the modal
    $scope.validationErrorMessage; // Error Message to show in the modal if input is invalid
    $scope.addJobFormSendBtn = "btn btn-default"; // 'Add' button style in the 'add job' modal
    $scope.addJobResultButtonValue = "Add"; // 'Add' button style in the 'add job' modal
    //$scope.progBarWidth = "width:20%"; // progress bar style , the width could be from 0 to 100
    //$scope.progBarCurStatus = "Loading.. (20%)"; // progress bar status that appears in the bar
    //$scope.progBarValue = 20; // progress bar current value


    /*************************************************************
     ********** Functions - Connecting Server Functions **********
     ************************************************************/

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
        $http.post(`${serviceUrl}/addJob`, newJob) // to check if build exist
            .success(function (res) {
                // handle response from server
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


    // Load All Jobs From The Server - Push Result Into $scope.listOfJobs array.
    $scope.loadJobs = function(){
    //    $scope.startProgressBar();
        $scope.activeLoader = false;
        $http.get(`${serviceUrl}/loadJobs`)
            .success(function(res){
                $scope.listOfJobs =  res;
                $scope.animateOnUpdate = "fadeIn";
                $scope.activeLoader = true;
        //        $scope.stopProgressBar();
            });
    };


    // Refresh Jobs List
    $scope.updateAllJobs = function(){
        $scope.animateOnUpdate = "fadeOut";
        $scope.loadJobs();
    };


    /*
     runs when a toggle button clicked on one of the jobs
     */
    $scope.toggleFreeze = function (job,btnType) {
        if( (btnType === 'onButton' && job.freeze.state === false) || // toggle if need to
            (btnType === 'offButton' && job.freeze.state === true)){
            job.freeze.state = !job.freeze.state; // change state
            if (job.freeze.onStyle == "btn btn-default") { // swap styles between 'on' and 'off' buttons
                job.freeze.onStyle = "btn btn-primary";
                job.freeze.offStyle = "btn btn-default";
            } else {
                job.freeze.offStyle = "btn btn-primary";
                job.freeze.onStyle = "btn btn-default";
            }
            $http.post(`${serviceUrl}/updateJob`, job) // send job to server to update freeze in DB
                .success(function (res) {
                    console.log("sent successfully");
                }
            );
        }
    };



    /*************************************************************
     ********** Functions - Affecting View Functions **********
     ************************************************************/


    /*
        Progress Bar running when load page.
        This function runs the progress bar and change the percent in it until reachs 100%
         */

    //$scope.startProgressBar = function(){
    //    $scope.progressBar = $interval(function() {
    //        $scope.progressBarStatus = true;
    //        $scope.progBarWidth = "width:" + $scope.progBarValue + "%";
    //        $scope.progBarCurStatus = "Loading.. (" + $scope.progBarValue + "%)";
    //        $scope.progBarValue += 10;
    //        if($scope.progBarValue == 100){
    //            $scope.stopProgressBar();
    //        }
    //    }, 700);
    //};

    //$scope.stopProgressBar = function(){
    //    if(angular.isDefined($scope.progressBar)){
    //        $interval.cancel($scope.progressBar);
    //        $scope.progressBarStatus = false;
    //        $scope.progBarValue= 20;
    //    }
    //}




    // the shown name should be the alias , if it not exist we will show the job name.
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

    // choose animated image or not , depending on the running status of the job
    $scope.chooseImg = function(job){
        if(job.building == true){
            return "../images/green_anime.gif";
        }else{
            return "../images/" + job.result + ".png";
        }
    };

    // update the class value of the table rows depending on job state (affecting the colour of the row)
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

    // update the class value of the table rows , depending on trStatus() and 'animateOnUpdate' to make it fade if reuqired
    $scope.styleJobRow = function(job){
        return $scope.trStatus(job) + " " + $scope.animateOnUpdate;
    }


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

