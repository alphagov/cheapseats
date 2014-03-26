var Mocha = require('mocha'),
    _ = require('underscore');

module.exports = function (browser, module, suite, config) {

  suite = Mocha.Suite.create(suite, module.slug);

  var tests = {
    exists: function () {
      return browser
        .elementByCssSelector('#' + module.slug)
          .should.eventually.exist;
    }
  };

  _.each(tests, function (test, key) {
    suite.addTest(new Mocha.Test(key, test));
  });

  try { // to load a test suite corresponding with the module-type
    var moduleTests = require('./modules/' + module['module-type']);
    moduleTests(browser, module, suite, config);
  } catch (e) {}

};
