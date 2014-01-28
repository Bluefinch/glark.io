module.exports = function (config) {
  config.set({
    basePath: '../',

    files: [
      'test/e2e/**/*.js'
    ],

    autoWatch: false,

    browsers: ['chromium-browser'],
    // browsers: ['PhantomJS'],

    singleRun: true,

    urlRoot: '/__karma/',

    proxies: {
      '/': 'http://localhost:3000/'
    },

    junitReporter: {
      outputFile: 'test_out/e2e.xml',
      suite: 'e2e'
    },

    frameworks: ['ng-scenario']
  });
};
