module.exports = function(app){

    var bodyParser = require('body-parser');
    app.use(bodyParser.json());

    // setup routes
    require('./routes/routes.js')(app);
    //require('./service/ciStatusService.js')();

};