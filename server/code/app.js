module.exports = function(app){

    var bodyParser = require('body-parser');
    app.use(bodyParser.json());


    // setup routes
    require('./../code/routes/routes.js')(app);

/*
    app.configure(function(){
        app.use(express.bodyParser());
    });
*/
};