var Mocha = require('mocha-extra-shot'),
    _ = require('underscore');

module.exports = function (browser, module, suite /*, config*/) {

  var tests = {
    'has stacks': function () {
      return browser
        .elementsByCssSelector('#' + module.slug + ' .graph svg path.stack').then(function (stacks) {
          stacks.length.should.equal(module.axes.y.length);
        })
        .each('#' + module.slug + ' .graph svg path.stack', function (stack, i) {
          return require('../graph/components').stack(browser, '#' + module.slug, i)();
        });
    }
  };

  _.each(tests, function (test, key) {
    suite.addTest(new Mocha.Test(key, test));
  });

};
