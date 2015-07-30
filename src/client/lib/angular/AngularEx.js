(function (angular) {
    var moduleFn = angular.module,
        requires = [],
        mi = null,
        configModule = angular.module('angularEx.Config', []),
        mainModule = angular.module('angularEx.main', requires);


    angular.module = function (moduleName, req, isApp) {
        var reqArray = null;
        switch (arguments.length) {
            case 1:
                reqArray = req || [];
                break;
            case 2:
                if (typeof req == "boolean") {
                    isApp = true;
                    reqArray = [];
                } else {
                    reqArray = req || [];
                }
                break;
            default:
        }

        try {
            mi = moduleFn(moduleName);
        } catch (e) {
            if (isApp) {
                //requires.concat(reqArray);
                mi = moduleFn(moduleName, ['angularEx.main', 'angularEx.Config']);
            } else {
                mi = moduleFn(moduleName, []);
                orderRequires(reqArray, mi.name);
                //requires.push(mi.name);
                //orderRequires(mi.name);
            }

            //console.log('module name: %s, requires: %s', mi.name, mi.requires.toString());
            //console.log(requires);
        }
        mi.config = conficAngularEx;//(mi.config);
        return mi;
    };

    function conficAngularEx(config) {
        configModule.config(config);
    }

    function orderRequires(mRequires, mName) {
        var index = requires.indexOf(mName);
        if (index === -1) {
            requires.push(mName);
            inseartRequiers(mRequires, requires.length - 1);
        } else {
            inseartRequiers(mRequires, index);
        }

        function inseartRequiers(mRequires, index) {
            var i = -1;
            mRequires.forEach(function (r) {
                i = requires.indexOf(r);
                if (i === -1) {
                    requires.splice(index, 0, r);
                } else {
                    if (i > index) {
                        requires.splice(i, 1);
                        requires.splice(index, 0, r);
                    }
                }
            });
        }
    }

})(angular);
