angular.module('tabs', ['firebase', 'ngSanitize', 'ui.select']).constant('ENV', {
    HOST: 'shnabel1',
    PORT: '4000'
});
angular.module('ui', ['tabs']);
