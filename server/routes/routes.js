module.exports = function(app){
    var data = require('../controllers/controllers.js');
    app.get('/test', data.test);
};