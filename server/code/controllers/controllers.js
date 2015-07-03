exports.UIDashboardController = function () {
    var fs = require('fs');
    var DATA_LOCATION = 'resources/test.json';
    return {

        save : function(req, res) {
            var dataToSave = JSON.stringify(req.body);
            fs.writeFile(DATA_LOCATION, dataToSave, 'utf8', function (err) {
                if (err) {
                    res.send(err);
                } else {
                    res.send('OK');
                }
            });
        },

        load: function (req, res) {
            fs.readFile(DATA_LOCATION, 'utf8', function (err, fileContent) {

                if (err) {
                    res.send(err);
                    return console.log(err);
                }

                res.send( JSON.parse(fileContent) );
            });
        }
    };
};
