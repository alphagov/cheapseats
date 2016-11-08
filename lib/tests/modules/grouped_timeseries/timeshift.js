var Mocha = require('mocha'),
    _ = require('underscore');

module.exports = function (browser, module, suite /*, config*/) {

  var tests = {
    'has timeshifted lines': function () {
      return browser
        .elementsByCssSelector('#' + module.slug + ' .graph svg path.line.timeshift').then(function (lines) {
          lines.length.should.equal(_.filter(module.axes.y, function (line) {
            return line.timeshift;
          }).length);
        });
    },
    'shows timeshifted elements in legend': function () {
      return browser
        .$('#' + module.slug + ' .graph figcaption.legend')
          .should.eventually.exist
        .each('#' + module.slug + ' .graph figcaption.legend li', function (key, i) {
          if (module.axes.y[i].timeshift) {
            return key.text()
              .should.eventually.contain(module.axes.y[i].label)
              .should.eventually.contain(module.axes.y[i].timeshift + ' ' + module.period + 's ago');
          }
        })
        .elementsByCssSelector('#' + module.slug + ' .graph figcaption.legend li.timeshift').then(function (keys) {
          keys.length.should.equal(_.filter(module.axes.y, function (line) {
            return line.timeshift;
          }).length);
        });
    }
  };

  _.each(tests, function (test, key) {
    suite.addTest(new Mocha.Test(key, test));
  });

};
