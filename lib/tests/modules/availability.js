var Mocha = require('mocha'),
    _ = require('underscore');

module.exports = function (browser, module, suite /*, config*/) {

  var tests = {
    'has a page load time numerical output': function () {
      return browser
        .$('#' + module.slug + ' .impact-number.response-time strong')
          .text()
            .should.eventually.match(/^([0-9\.]+s)|(\(no data\))$/);

    },
    'has a page load time graph': require('./graph/components').line(browser, '#' + module.slug + ' .response-time-graph'),
    'has an uptime time numerical output': function () {
      return browser
        .$('#' + module.slug + ' .impact-number.uptime strong')
          .text()
            .should.eventually.match(/^[0-9\.]+%$/);

    },
    'has an uptime time graph': require('./graph/components').line(browser, '#' + module.slug + ' .uptime-graph')
  };

  _.each(tests, function (test, key) {
    suite.addTest(new Mocha.Test(key, test));
  });

};
