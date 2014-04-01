var wd = require('wd'),
    chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    Q = require('q'),
    Mocha = require('mocha'),
    argh = require('argh'),
    util = require('util'),
    config = require('./config'),
    enableWDLogging = require('./lib/logging'),
    spotlight = require('./lib/spotlight'),
    dashboardTest = require('./lib/tests/dashboard');

util._extend(config, argh.argv);

chai.use(chaiAsPromised);
chai.should();
chaiAsPromised.transferPromiseness = wd.transferPromiseness;

var mocha = new Mocha({
  reporter: config.reporter,
  timeout: config.timeout,
  slow: config.slow,
  grep: argh.argv.grep
});

require('./lib/wd-helpers')(wd, config);

var browser = wd.promiseChainRemote({port: config.port});

enableWDLogging(browser);

browser.init()
  .then(spotlight.init(config))
  .then(spotlight.dashboards)
  .then(function (dashboards) {
    var suite = Mocha.Suite.create(mocha.suite, 'Dashboards');
    dashboards.forEach(function (dashboard) {
      dashboardTest(browser, dashboard, suite, config);
    });
  })
  .then(function () {
    return Q.ninvoke(mocha, 'run');
  })
  .fin(function () {
    return browser.quit();
  });