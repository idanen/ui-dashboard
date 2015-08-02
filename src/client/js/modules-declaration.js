angular.module('tabs', ['firebase', 'ngSanitize', 'ui.select']).constant('ENV', {
    HOST: 'myd-vm01818.hpswlabs.adapps.hp.com/',
    PORT: '4000'
});
angular.module('ui', ['tabs']);
