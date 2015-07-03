module.exports = function(grunt) {
    grunt.initConfig({
        watch: {
            all: {
                files: ['../src/client/**/*.js', '../src/client/**/*.html', '!../src/client/index/index.html'],
                tasks: ['execute']
            }
        },
        execute: {
            target: {
                src: ['reCreateIndex.js']
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-execute');

    // will invoke first time creation of the index.html and start the files watcher to recreate again and again once needed
    grunt.registerTask('start', ['execute', 'watch']);
};