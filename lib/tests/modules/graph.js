var Mocha = require('mocha'),
    _ = require('underscore');

module.exports = function (browser, module, suite /*, config*/) {

  module.axes.x = module.axes.x || {
    label: 'Date'
  };

  var tests = {
    'has a graph': function () {
      return browser
        .$('#' + module.slug + ' .graph')
          .should.eventually.exist;
    },
    'has axes': function () {
      return browser
        .$('#' + module.slug + ' .graph svg .x-axis')
          .should.eventually.exist
        .$('#' + module.slug + ' .graph svg .y-axis')
          .should.eventually.exist;
    }
  };

  _.each(tests, function (test, key) {
    suite.addTest(new Mocha.Test(key, test));
  });

};
