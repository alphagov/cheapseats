var Mocha = require('mocha');

module.exports = function (browser, dashboard, suite, config) {

  suite.beforeAll(function () {
    return browser.get(config.baseUrl + dashboard.slug);
  });

  suite.addTest(new Mocha.Test('exists', exists));

  var modules = Mocha.Suite.create(suite, 'modules');
  dashboard.modules.forEach(function (module) {
    modules.addTest(new Mocha.Test(module.slug, require('./module-exists')(browser, module, config.baseUrl)));
  });

  function exists() {
    return browser
      .title()
        .should.become(dashboard.title + ' - ' + dashboard.strapline + ' - GOV.UK')
      .elementByCssSelector('h1')
      .text()
        .should.eventually.equal(dashboard.strapline + '\n' + dashboard.title);
  }

};