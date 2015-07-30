module.exports = function(app){

    var bodyParser = require('body-parser');
    var cors = require('cors');

    app.use(cors());
    app.use(bodyParser.json());

    // setup routes
    require('./routes/routes.js')(app);

    console.info('Hello server side');

};