var Mocha = require('mocha'),
    _ = require('underscore');

module.exports = function (browser, module, suite /*, config*/) {
  var moduleName = module.slug;

  var tests = {

    'has a kpi value': function () {
      return browser
        .$('#' + moduleName + ' .stat strong').text()
          .should.eventually.match(/^((£)?[0-9\.]+[b,m,k]?)|(no data)$/);
    }
  };

  _.each(tests, function (test, key) {
    suite.addTest(new Mocha.Test(key, test));
  });

};
