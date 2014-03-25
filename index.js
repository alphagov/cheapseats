var wd = require('wd'),
    chai = require("chai"),
    chaiAsPromised = require("chai-as-promised"),
    enableWDLogging = require('./logging'),
    spotlight = require('./spotlight'),
    Q = require('q'),
    Mocha = require('mocha'),
    config = require('./config'),
    argh = require('argh'),
    util = require('util');

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
    var dashboardTests = Mocha.Suite.create(mocha.suite, 'Dashboards Exist');
    dashboards.forEach(function (dashboard) {
      dashboardTests.addTest(new Mocha.Test(dashboard.title, require('./lib/modules/dashboard-exists')(browser, dashboard, config.baseUrl)));
    });
  })
  .then(function () {
    return Q.ninvoke(mocha, 'run');
  })
  .fin(function () {
    return browser.quit();
  })
  .done();