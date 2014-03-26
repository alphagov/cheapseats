var wd = require('wd'),
    chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    Q = require('q'),
    Mocha = require('mocha'),
    argh = require('argh'),
    util = require('util'),
    config = require('./config'),
    enableWDLogging = require('./lib/logging'),
    spotlight = require('./lib/spotlight');

util._extend(config, argh.argv);

chai.use(chaiAsPromised);
chai.should();
chaiAsPromised.transferPromiseness = wd.transferPromiseness;

var mocha = new Mocha({
  reporter: config.reporter,
  timeout: config.timeout,
  slow: config.slow
});

var browser = wd.promiseChainRemote({port: config.port});

enableWDLogging(browser);

browser.init()
  .then(spotlight.init(config))
  .then(spotlight.dashboards)
  .then(function (dashboards) {
    var dashboardTests = Mocha.Suite.create(mocha.suite, 'Dashboards');
    dashboards.forEach(function (dashboard) {
      var dashboardSuite = Mocha.Suite.create(dashboardTests, dashboard.title),
          moduleSuite = Mocha.Suite.create(dashboardSuite, 'modules');

      dashboardSuite.addTest(new Mocha.Test('exists', require('./lib/modules/dashboard-exists')(browser, dashboard, config.baseUrl)));

      dashboard.modules.forEach(function (module) {
        moduleSuite.addTest(new Mocha.Test(module.slug, require('./lib/modules/module-exists')(browser, module, config.baseUrl)));
      });
    });
  })
  .then(function () {
    return Q.ninvoke(mocha, 'run');
  })
  .fin(function () {
    return browser.quit();
  })
  .done();