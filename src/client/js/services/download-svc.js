(function () {
  'use strict';

  angular.module('ci-site')
      .service('downloadService', DownloadService);

  DownloadService.$inject = ['$document', '$timeout'];
  function DownloadService($document, $timeout) {
    this.$document = $document;
    this.$timeout = $timeout;
    this.downloadLink = $document[0].createElement('a');
    $document.find('body').append(this.downloadLink);
    this.downloadLink.innerText = 'downloader';
    this.downloadLink.style.visibility = 'hidden';
    this.downloadLink.style.position = 'absolute';
    this.downloadLink.style.top = '-50px';
    this.downloadLink.style.left = '0';
  }

  DownloadService.prototype = {
    download(options) {
      this.downloadLink.setAttribute('href', encodeURI(options.data));
      this.downloadLink.setAttribute('download', options.filename || 'file.csv');
      this.$timeout(() => {
        this.downloadLink.click();
      }, 50, false);
    }
  };
}());
