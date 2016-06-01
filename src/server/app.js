module.exports = function(app){

    var bodyParser = require('body-parser');
    var cors = require('cors');

    app.use(cors());
    app.use(bodyParser.json({ limit: '50mb' }));

    // setup routes
    require('./routes/routes.js')(app);
    //require('./service/ciStatusService.js')();

    console.info('Hello server side');

};