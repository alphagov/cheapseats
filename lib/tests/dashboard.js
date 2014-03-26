var Mocha = require('mocha'),
    _ = require('underscore'),
    moduleTest = require('./module');

module.exports = function (browser, dashboard, suite, config) {

  suite = Mocha.Suite.create(suite, dashboard.title);

  suite.beforeAll(function () {
    return browser.get(config.baseUrl + dashboard.slug);
  });

  var tests = {
    exists: function exists() {
      return browser
        .title()
          .should.become(dashboard.title + ' - ' + dashboard.strapline + ' - GOV.UK')
        .$('h1').text()
          .should.eventually.equal(dashboard.strapline + '\n' + dashboard.title);
    }
  };

  _.each(tests, function (test, key) {
    suite.addTest(new Mocha.Test(key, test));
  });

  var modules = Mocha.Suite.create(suite, 'modules');
  dashboard.modules.forEach(function (module) {
    moduleTest(browser, module, modules, config);
  });

};