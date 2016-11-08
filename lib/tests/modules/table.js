var Mocha = require('mocha'),
    _ = require('underscore');

module.exports = function (browser, module, suite /*, config*/) {

  var tests = {
    'has table headings': require('./table/components').headings(browser, '#' + module.slug, module.axes),
    'has table rows': require('./table/components').rows(browser, '#' + module.slug, module.axes)
  };

  _.each(tests, function (test, key) {
    suite.addTest(new Mocha.Test(key, test));
  });

};
