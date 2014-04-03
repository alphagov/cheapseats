var Mocha = require('mocha'),
    _ = require('underscore');

module.exports = function (browser, module, suite /*, config*/) {

  var tests = {
    'has stacks': function () {
      return browser
        .elementsByCssSelector('#' + module.slug + ' .graph svg .stacks path.stack').then(function (stacks) {
          stacks.length.should.equal(module.axes.y.length);
        });
    }
  };

  _.each(tests, function (test, key) {
    suite.addTest(new Mocha.Test(key, test));
  });

};
