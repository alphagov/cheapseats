var Mocha = require('mocha'),
    _ = require('underscore');

module.exports = function (browser, module, suite /*, config*/) {

  var tests = {
    'has a graph': function () {
      return browser
        .$('#' + module.slug + ' .sparkline')
          .should.eventually.exist;
    }
  };

  _.each(tests, function (test, key) {
    suite.addTest(new Mocha.Test(key, test));
  });

};
