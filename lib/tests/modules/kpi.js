var Mocha = require('mocha'),
    _ = require('underscore');

module.exports = function (browser, module, suite, config) {

  var tests = {
    'has a kpi value': function () {
      return browser
        .$('#' + module.slug + ' .stat strong').text()
          .should.eventually.match(config.valueRegex);
    }
  };

  _.each(tests, function (test, key) {
    suite.addTest(new Mocha.Test(key, test));
  });

};
