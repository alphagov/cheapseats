var Mocha = require('mocha-extra-shot'),
    _ = require('underscore');

module.exports = function (browser, module, suite, config, tests) {

  suite = Mocha.Suite.create(suite, module.slug);

  tests = _.extend({
    exists: function () {
      return browser
        .$('#' + module.slug).isDisplayed()
          .should.eventually.be.ok;
    },

    'contains no error message': function () {
      return browser
        .hasElementByCssSelector('#' + module.slug + ' h2.error')
          .should.eventually.not.be.ok;
    },

    'has a title': function () {
      return browser
        .$('#' + module.slug + ' h2').text()
          .should.eventually.equal(module.title);
    }

  }, tests);

  _.each(tests, function (test, key) {
    suite.addTest(new Mocha.Test(key, test));
  });

  try { // to load a test suite corresponding with the module-type
    var moduleTests = require('./modules/' + module['module-type']);
    moduleTests(browser, module, suite, config);
  } catch (e) {
    if (e.code === 'MODULE_NOT_FOUND') {
      suite.addTest(new Mocha.Test('no test suite is defined for module-type ' + module['module-type']));
    }
  }

  return suite;

};
