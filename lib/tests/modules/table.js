var Mocha = require('mocha'),
    _ = require('underscore'),
    Q = require('q');

module.exports = function (browser, module, suite /*, config*/) {

  var tests = {
    'has table headings': function () {
      return browser
        .elementsByCssSelector('#' + module.slug + ' table thead th').then(function (headings) {
          return Q.all(_.map(headings, function (th, i) {
            if (i) {
              return th.text().should.eventually.contain(module.axes.y[i - 1].label);
            } else {
              return th.text().should.eventually.equal(module.axes.x.label);
            }
          }));
        });
    }
  };

  _.each(tests, function (test, key) {
    suite.addTest(new Mocha.Test(key, test));
  });

};
