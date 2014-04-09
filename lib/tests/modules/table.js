var Mocha = require('mocha'),
    _ = require('underscore');

module.exports = function (browser, module, suite /*, config*/) {

  var tests = {
    'has table headings': function () {
      return browser
        .each('#' + module.slug + ' table thead th', function (th, i) {
          if (i) {
            return th.text().should.eventually.contain(module.axes.y[i - 1].label);
          } else {
            return th.text().should.eventually.equal(module.axes.x.label);
          }
        });
    }
  };

  _.each(tests, function (test, key) {
    suite.addTest(new Mocha.Test(key, test));
  });

};
