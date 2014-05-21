var wd = require('wd'),
    chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    Q = require('q'),
    Mocha = require('mocha'),
    argh = require('argh'),
    util = require('util'),
    _ = require('underscore'),
    config = require('./config'),
    enableWDLogging = require('./lib/logging'),
    spotlight = require('./lib/spotlight'),
    driver = require('./lib/driver'),
    server = require('./lib/server'),
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

var browser = wd.promiseChainRemote({port: config.port}),
  exitcode = 1;

enableWDLogging(browser);

if (config.reporter === 'json') {
  console.log = function () {};
}

function testDashboards(config, prefix) {
  prefix = prefix || '';
  var title = [prefix, 'Dashboards'].join(' ');
  return spotlight.init(config)()
    .then(spotlight.dashboards)
    .then(function (dashboards) {

      var range = (argh.argv.range || '').split('..');
      range[0] = parseInt(range[0], 10) || 0;
      if (range.length === 1) {
        range[1] = range[0] + 1;
      } else {
        range[1] = range[1] ? parseInt(range[1], 10) : dashboards.length;
      }

      var suite = Mocha.Suite.create(mocha.suite, title);
      dashboards.forEach(function (dashboard, i) {
        if (i >= range[0] && i < range[1]) {
          dashboardTest(browser, dashboard, suite, config);
        }
      });
    });
}
config.valueRegex = /^(((£)?[0-9\.,]+(bn|m|k|%)?)|\(?no data\)?)$/;

driver.init(browser, config)
  .then(function () {
    if (!config.baseUrl || config.standalone) {
      return server.start(config);
    }
  })
  .then(function () {
    return testDashboards(config);
  })
  .then(function () {
    return Q.ninvoke(mocha, 'run');
  })
  .then(function () {
    exitcode = 0;
  }, function () {
    exitcode = 1;
  })
  .fin(function () {
    return browser.quit();
  })
  .then(function () {
    driver.kill();
    server.kill();
  })
  .fin(function () {
    process.exit(exitcode);
  });
