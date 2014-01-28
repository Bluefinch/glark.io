module.exports = function (config) {
  config.set({
    basePath: '../',

    files: [
      'app/lib/angular/angular.js',
      'app/lib/angular/angular-*.js',
      'test/lib/angular/angular-mocks.js',
      'app/js/**/*.js',
      'test/unit/**/*.js'
    ],

    exclude: ['app/js/services/diffMatchPatchWorker.js'],

    autoWatch: true,

    // browsers: ['chromium-browser'],
    browsers: ['PhantomJS'],

    junitReporter: {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    },
  
    frameworks: ['jasmine']
  });
};
