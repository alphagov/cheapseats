var Mocha = require('mocha-extra-shot'),
    _ = require('underscore');

module.exports = function (browser, module, suite /*, config*/) {

  var tests = {
    'has lines': function () {
      return browser
        .elementsByCssSelector('#' + module.slug + ' .graph svg path.line').then(function (lines) {
          lines.length.should.equal(module.axes.y.length);
        });
    }
  };

  _.each(tests, function (test, key) {
    suite.addTest(new Mocha.Test(key, test));
  });

};
