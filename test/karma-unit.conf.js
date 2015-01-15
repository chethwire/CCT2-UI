// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function (config) {
    config.set({
            // base path, that will be used to resolve files and exclude
            basePath: '../',

            // testing framework to use (jasmine/mocha/qunit/...)
            frameworks: ['jasmine'],

            // list of files / patterns to load in the browser
            files: [
                'app/bower_components/jquery/jquery.js',
                'app/bower_components/jquery.cookie/jquery.cookie.js',
                'app/bower_components/angular/angular.js',
                'app/bower_components/angular-animate/angular-animate.js',
                'app/bower_components/angular-mocks/angular-mocks.js',
                'app/bower_components/angular-route/angular-route.js',
                'app/bower_components/angular-local-storage/angular-local-storage.js',
                'app/bower_components/get-style-property/get-style-property.js',
                'app/bower_components/get-size/get-size.js',
                'app/bower_components/eventie/eventie.js',
                'app/bower_components/doc-ready/doc-ready.js',
                'app/bower_components/eventEmitter/EventEmitter.js',
                'app/bower_components/jquery-bridget/jquery.bridget.js',
                'app/bower_components/matches-selector/matches-selector.js',
                'app/bower_components/imagesloaded/imagesloaded.js',
                'app/bower_components/outlayer/item.js',
                'app/bower_components/outlayer/outlayer.js',
                'app/bower_components/masonry/masonry.js',
                'app/bower_components/jquery-ui/ui/jquery-ui.js',
                'app/bower_components/angular-masonry/angular-masonry.js',
                'app/bower_components/angular-bootstrap-colorpicker/js/bootstrap-colorpicker-module.js',
                'app/bower_components/angulartics/src/angulartics.js',
                'app/bower_components/angulartics/src/angulartics-ga.js',
                'app/bower_components/angular-ui-date/src/date.js',
                'app/bower_components/angular-ui-select2/src/select2.js',
                'app/bower_components/angular-strap/dist/angular-strap.js',
                'app/bower_components/angular-ui-sortable/src/sortable.js',
                'app/scripts/*.js',
                'app/scripts/**/*.js',

                'test/spec/**/*.js'
            ],

            //generate js files from html templates to expose them during testing
            preprocessors: {
                'app/views/templates/**/*.html': 'html2js'

            },

            // list of files / patterns to exclude
            exclude: [],

            // web server port
            port: 8080,

            // level of logging
            // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
            logLevel: config.LOG_INFO,


            // enable / disable watching file and executing tests whenever any file changes
            autoWatch: false,


            // Start these browsers, currently available:
            // - Chrome
            // - ChromeCanary
            // - Firefox
            // - Opera
            // - Safari (only Mac)
            // - PhantomJS
            // - IE (only Windows)
            browsers: ['Chrome'],

            reporters: ['coverage'],
            preprocessors: {
                // source files, that you wanna generate coverage for
                // do not include tests or libraries
                // (these files will be instrumented by Istanbul)
                'app/scripts/**/*.js': ['coverage']
            },

            // Continuous Integration mode
            // if true, it capture browsers, run tests and exit
            singleRun: true
        }
    )
    ;
}
;
