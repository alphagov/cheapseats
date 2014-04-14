var Mocha = require('mocha'),
    _ = require('underscore');

module.exports = function (browser, module, suite /*, config*/) {

  var tests = {
    'has a kpi value': function () {
      return browser
        .$('#' + module.slug + ' .stat strong').text()
          .should.eventually.match(/^((£)?[0-9\.]+[bmk]?)|(no data)$/);
    }
  };

  _.each(tests, function (test, key) {
    suite.addTest(new Mocha.Test(key, test));
  });

};
