function startServer() {
    var express = require('express');
    var app = express();

    app.get('/', function (req, res) {
        res.send('Hello World!')
    });

    app.use(express.static('src'));
    app.use(express.static('src/index'));

    var server = app.listen(3000, function () {
        var host = server.address().address;
        var port = server.address().port;

        console.log('Example app listening at http://%s:%s', host, port);
    })
}

startServer();