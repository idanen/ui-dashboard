function startServer() {
    var express = require('express');
    var app = express();

    require('./../src/server/app.js')(app);

    app.use(express.static('dist'));
    //app.use(express.static('src/client/index'));

    app.all('/*', function(req, res, next) {
        // Just send the index.html for other files to support HTML5Mode
        res.sendFile('index.html', { root: 'dist' });
    });

    var server = app.listen(4000, function () {
        var host = server.address().address;
        var port = server.address().port;

        console.log('Example app listening at http://%s:%s', host, port);
    });
}

startServer();