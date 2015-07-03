module.exports = function(app){
    var data = require('./../../code/controllers/controllers.js');
    app.get('/test', data.test);
};