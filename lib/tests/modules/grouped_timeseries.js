var Mocha = require('mocha'),
    _ = require('underscore');

module.exports = function (browser, module, suite /*, config*/) {

  var tests = {
    'has a legend': function () {
      return browser
        .$('#' + module.slug + ' .graph figcaption.legend')
          .should.eventually.exist
        .each('#' + module.slug + ' .graph figcaption.legend li', function (key, i) {
          return key.text().should.eventually.contain(module.axes.y[i].label);
        });
    }
  };

  require('./graph').apply(null, arguments);

  _.each(tests, function (test, key) {
    suite.addTest(new Mocha.Test(key, test));
  });

  if (module.useStack) {
    require('./grouped_timeseries/stack').apply(null, arguments);
  } else {
    require('./grouped_timeseries/line').apply(null, arguments);
  }

  if (_.any(module.axes.y, function (series) { series.timeshift; })) {
    require('./grouped_timeseries/timeshift').apply(null, arguments);
  }

};
