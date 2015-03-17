var wd = require('wd'),
    chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    Q = require('q'),
    Mocha = require('mocha-extra-shot'),
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
  bail: config.bail,
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
    .then(function() {
      return spotlight.dashboards(config.dashboard);
    })
    .then(function (dashboards) {
      var range = (argh.argv.range || '').split('..');
      range[0] = parseInt(range[0], 10) || 0;
      if (range.length === 1 && argh.argv.range) {
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
config.durationRegex = /^(([0-9]+m )?([0-9]+s)?|\(?no data\)?)$/;
config.dateRegex = /(\d{1,2} )?(Jan|Feb|Mar|Apr|May|June|July|Aug|Sep|Oct|Nov|Dec) (19\d{2}|2\d{3})/;
config.monthRegex = /(January|February|March|April|May|June|July|August|September|October|November|December) (19\d{2}|2\d{3})/;

driver.init(browser, config)
  .then(function () {
    if (!config.baseUrl || config.standalone) {
      return server.start(config);
    }
  })
  .then(function () {
    config.quickRun = argh.argv.quickrun;
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
