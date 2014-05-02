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
      var suite = Mocha.Suite.create(mocha.suite, title);
      dashboards.forEach(function (dashboard) {
        dashboardTest(browser, dashboard, suite, config);
      });
    });
}
config.valueRegex = /^((£)?[0-9\.]+[bmk]?)|\(?no data\)?$/;

driver.init(browser, config)
  .then(function () {
    if (!config.baseUrl || config.standalone) {
      return server.start(config);
    }
  })
  .then(function () {
    if (argh.argv.experimental) {
      var experimental = (typeof argh.argv.experimental === 'string') ? argh.argv.experimental : 'experimental';
      return testDashboards(_.extend({}, config, {
        baseUrl: config.baseUrl + experimental + '/',
        stubDir: config.stubDir + experimental + '/'
      }), 'Experimental');
    } else {
      return testDashboards(config);
    }
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
