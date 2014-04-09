var Mocha = require('mocha'),
    _ = require('underscore');

module.exports = function (browser, module, suite /*, config*/) {

  var tests = {

    'has a stack and a line': function () {
      var linePath;
      return browser
        .$('#' + module.slug + ' svg .lines .line0')
          .should.eventually.exist
          .getAttribute('d').then(function (d) {
            linePath = d.split('M')[1];
          })
        .$('#' + module.slug + ' svg .stacks .stack0')
          .should.eventually.exist
          .getAttribute('d').then(function (d) {
            // the line follows the top of the stack, so the line path should be a
            // substring of the stack path
            d.should.contain(linePath);
          });
    }

  };

  _.each(tests, function (test, key) {
    suite.addTest(new Mocha.Test(key, test));
  });

};
