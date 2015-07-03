function escapeRegExp(string) {
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

function replaceAll(find, replace, str) {
    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

function recreateIndexHTML() {
    var walk    = require('walk');
    var files   = [];
    var PATH_PREFIX = '../src/client/';
    var INDEX_TEMPLATE_FILE_LOCATION = PATH_PREFIX + 'index/index_template.html';
    var INDEX_FILE_LOCATION = PATH_PREFIX + 'index/index.html';
    var walker  = walk.walk(PATH_PREFIX + 'js', { followLinks: false });

    walker.on('file', function(root, stat, next) {
        if (stat.name.indexOf('.js') === -1) {
            next();
            return;
        }
        root = root.substr(PATH_PREFIX.length);
        var correctRoot = replaceAll('\\', '/', root);
        var fileName = correctRoot + '/' + stat.name;
        var scriptLine = '<script src="' + fileName + '"><' + '/script>';
        files.push(scriptLine);
        next();
    });

    walker.on('end', function() {
        //console.log('Example ' + files);
        plantDynamicSourceFiles(files);
    });

    function plantDynamicSourceFiles(files) {
        var fs = require('fs');
        fs.readFile(INDEX_TEMPLATE_FILE_LOCATION, 'utf8', function (err,data) {
            if (err) {
                return console.log(err);
            }
            var strings = ['<!--dynamic code-->'].concat(files);
            var scriptsAsString = strings.join('\n\t\t');
            var result = data.replace('<!--dynamic code-->', scriptsAsString);

            fs.writeFile(INDEX_FILE_LOCATION, result, 'utf8', function (err) {
                if (err) {
                    return console.log(err);
                }
            });
        });
    }

}

module.exports.recreateIndexHTML = recreateIndexHTML;
