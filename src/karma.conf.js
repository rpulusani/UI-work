// Karma configuration
// Generated on Wed Aug 26 2015 09:40:00 GMT-0500 (CDT)

module.exports = function(config) {
    config.set({
        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: './',

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine', 'requirejs'],

        // list of files / patterns to load in the browser
        files: [
            {pattern: 'client/app/**/*.js', included: false},
            {pattern: 'client/etc/**/*.js', included: false},
            {pattern: 'client/tests/angular-mocks.js', included: false},
            {pattern: 'client/tests/fixtures.js', included: false},
            {pattern: 'client/tests/mock-gatekeeper.js', included: false},
            {pattern: 'client/tests/*_spec.js', included: false},
            'client/tests/test-main.js'
        ],

        // list of files to exclude
        exclude: [],

        plugins: [
            'karma-jasmine',
            'karma-phantomjs-launcher',
            'karma-junit-reporter',
            'karma-coverage',
            'karma-requirejs'
        ],

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {'client/app/**/*.js': ['coverage']},

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress', 'dots', 'junit', 'coverage'],

        // web server port
        port: 9090,
        runnerPort: 9191,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_DEBUG,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['PhantomJS'],

        coverageReporter: {
            reporters: [
              { type: 'cobertura', dir: '.' }
            ]
        },

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true,

        junitReporter: {
            outputFile: 'test-results.xml',
            outputDir: '../'
        }
    });
};
