module.exports = function(config){
  config.set({

    basePath : './',

    files : [
        'client/js/libs/angular.min.js',
        'client/test/angular-mocks.js',
        'client/js/**/*.js',
        'client/hello/*.js',
        'client/test/*.js'
    ],

    autoWatch : true,

    hostname: process.env.IP,
    port: process.env.PORT,
    runnerPort: 0,

    frameworks: ['jasmine'],

    browsers : ['PhantomJS'],

    plugins : [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-phantomjs-launcher',
            'karma-jasmine',
            'karma-junit-reporter'
            ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

  });
};