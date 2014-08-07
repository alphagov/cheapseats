var Mocha = require('mocha-extra-shot'),
    _ = require('underscore');

module.exports = function (browser, module, suite /*, config*/) {

  var tests = {};

  _.each(tests, function (test, key) {
    suite.addTest(new Mocha.Test(key, test));
  });

  require('./grouped_timeseries').apply(null, arguments);

};
