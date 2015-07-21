(function (angular) {
    'use strict';

    angular.module('tabs').service('TeamMembersService', [function ( ) {

        this.members = createMembers();

        this.uniqueMemberId = this.members.length;

        this.addMember = function (member) {
            member.memberId = this.uniqueMemberId;
            this.uniqueMemberId++;

            var tmp = {};
            angular.copy(member, tmp);
            this.members.push(tmp);
        };

        this.getMemberByID = function (memberId) {
            if (memberId) {
                var member = this.members.filter(function (obj) {
                    return obj.memberId == memberId;
                })[0];
                return member;
            }
        };
    }]);

    angular.module('tabs').controller('membersController', ['$scope', 'TeamMembersService', function ($scope, TeamMembersService) {
        $scope.currentPage = 1;
        $scope.tmp = TeamMembersService.members;
        $scope.paginate = function () {
            if ($scope.tmp.length < 10)
                $scope.members = $scope.tmp;
            else {
                $scope.members = $scope.tmp.slice(($scope.currentPage - 1) * 10, ($scope.currentPage * 10) - 1);
            }

        };
        $scope.paginate();

        $scope.goPrevPage = function () {
            if ($scope.currentPage > 1) {
                $scope.currentPage--;
                $scope.paginate();
            }
        };

        $scope.goNextPage = function () {
            if ($scope.tmp.length >= ($scope.currentPage * 10)) {
                $scope.currentPage++;
                $scope.paginate();
            }
        };


        $scope.addMember = function (member) {
            TeamMembersService.addMember(member);
            angular.forEach($scope.members, function (member, index) {
                //Just add the index to your item
                member.index = index;
            });
            $scope.paginate();
        };

        angular.forEach($scope.members, function (member, index) {
            //Just add the index to your item
            member.index = index;
        });

    }]);

    function createMembers() {
        var members = [
            {memberId:0, fname:"Eli",   lname:"Koren",   email:"eli.koren@hp.com"},
            {memberId:1, fname:"Fadi",  lname:"Matar",   email:"fadi.matar@hp.com"},
            {memberId:2, fname:"Aviad", lname:"Cohen",   email:"aviad.cohen@hp.com"},
            {memberId:3, fname:"Mazit", lname:"Bentora", email:"mazit.bentora@hp.com"},
            {memberId:4, fname:"Idan",  lname:"Entin",   email:"idan.entin@hp.com"},
            {memberId:5, fname:"Ofer",  lname:"Spivak",  email:"ofer.spivak@hp.com"},
            {memberId:6, fname:"Idit",  lname:"Gluck",   email:"idit.gluck@hp.com"},
            {memberId:7, fname:"Noam",  lname:"Katzir",  email:"noam.katzir@hp.com"},
            {memberId:8, fname:"Yael",  lname:"Schnabel",email:"yael.schnabel@hp.com"},
            {memberId:9, fname:"Evgeny",lname:"Ogurko",  email:"evgeny.ogurko@hp.com"}],
            gravatarUrlTemplate = 'http://www.gravatar.com/avatar/',
            randomImgs = ["http://i406.photobucket.com/albums/pp143/angelhavingfun2/Fabric%20Textures/extras/fjardine-blush-flower.png", "https://pbs.twimg.com/profile_images/695208912/Diego_South_Park_2009__square__400x400.png", "http://www.officialpsds.com/images/thumbs/Thundercats-psd33581.png", "http://www.freegreatdesign.com/files/images/6/2809-4-cute-elephant-png-icon-1.jpg", "http://vignette3.wikia.nocookie.net/fantendo/images/e/eb/Mario_SM3DW.png/revision/latest?cb=20120122014152", "http://lh5.ggpht.com/-_1pDGXMyu7Y/UMVqxR13BFI/AAAAAAAAAJw/0ns2PhRiZbY/s9000/cat.png", "http://www.clipartbest.com/cliparts/eTM/KXe/eTMKXe8Tn.png", "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcSnJDSDJPnTTxb9iUBdK6DBFf4lHAv8VaRHVJKDlfTxWBhWZbptf3NGW6Q", "http://www.mykonosgreekcuisine.com/Cute_Dog_Clipart.png", "http://www.clker.com/cliparts/P/N/C/N/f/d/cartoon-elephant-hi.png"
            ];

        members.forEach(function (member) {
            member.img = gravatarUrlTemplate + md5(member.email) + '?d=' + escape(randomImgs.shift());
        });

        return members;
    }
})(window.angular);
