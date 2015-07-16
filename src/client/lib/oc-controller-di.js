(function (angular) {
    var isObject = angular.isObject;
    var extend = angular.extend;

    angular.module("ocControllerDI", []).config(["$injector", "$controllerProvider", function (providerInjector, $controllerProvider) {
        //
        //  A regular expression to parse controller name (for examle, "HomeCtrl as ctrl")
        //  Is copied from from angular source code
        //
        var CNTRL_REG = /^(\S+)(\s+as\s+(\w+))?$/;

        //
        //  A map of all registered controllers
        //  Is uses later to extract $inject for new controller
        //
        var controllers = {};

        //
        //  We are going to monkey patch $controllerProvider so save it before overriding
        //
        var originalControllerProvider = {
            $get: $controllerProvider.$get,
            register: $controllerProvider.register
        };

        //
        //  Monkey patch register
        //
        $controllerProvider.register = function (name, constructor) {
            originalControllerProvider.register.apply(this, arguments);

            if (isObject(name)) {
                extend(controllers, name);
            }
            else {
                controllers[name] = constructor;
            }
        }

        //
        //  Monkey patch $controller
        //  Every request to create a controller is now delegated to our implementation
        //
        $controllerProvider.$get = ["$injector", function ($injector) {
            //
            //  Get a reference to the real $controller
            //
            var $controller = $injector.invoke(originalControllerProvider.$get, this);

            //
            //  Return new $controller
            //
            return function (expression, locals, later, ident) {
                //
                //  Invoke the original $controller and get a reference to the controller instance
                //  this instance is not initialized yet (the ctor was not invoked)
                //
                var res = $controller.apply(this, arguments);

                if (!later) {
                    //
                    //  Current Angular implementation uses a "later" technique
                    //  Which means that Angular first creates the controller instance and only later invokes the ctor
                    //  We can only do our magic if angular works in a "later" mode
                    //
                    return res;
                }

                //
                //  A controller instance (ctor was not invoked yet)
                //
                var controller = res.instance;

                var dependencies = null;

                //
                //  This is a copy of Angular code to handle complex controller expression like "HomeCtrl as ctrl"
                //
                var match = expression.match(CNTRL_REG);
                var constructor = match[1];
                var expression = controllers[constructor];
                if (angular.isArray(expression)) {
                    //
                    //  Extract only the dependencies
                    //
                    dependencies = expression.slice(0, expression.length - 1);
                }

                if (dependencies) {
                    //
                    //  Build a local function with controller dependencies and copy them into the controller instance
                    //
                    initController.$inject = dependencies;
                    function initController() {
                        for (var i = 0; i < dependencies.length; i++) {
                            controller[dependencies[i]] = arguments[i];
                        }
                    }

                    $injector.invoke(initController, this, locals);
                }

                return res;
            }
        }];
    }]);
})(angular);
