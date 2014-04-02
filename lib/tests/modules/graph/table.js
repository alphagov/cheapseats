var Mocha = require('mocha'),
    _ = require('underscore');

module.exports = function (browser, module, suite /*, config*/) {

  suite = suite = Mocha.Suite.create(suite, 'table');

  var tests = {
    'has a table': function () {
      return browser
        .$('#' + module.slug + ' .table-toggle table')
          .should.eventually.exist;
    },
    'table is shown by clicking link': function () {
      return browser
        .$('#' + module.slug + ' .table-toggle table').isDisplayed()
          .should.eventually.not.be.ok
        .$('#' + module.slug + ' .table-toggle > a').click()
        .$('#' + module.slug + ' .table-toggle table').isDisplayed()
          .should.eventually.be.ok;
    }
  };

  _.each(tests, function (test, key) {
    suite.addTest(new Mocha.Test(key, test));
  });

  require('../table').apply(null, arguments);

};
