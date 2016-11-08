var Mocha = require('mocha'),
    _ = require('underscore'),
    moduleTest = require('./module');

module.exports = function (browser, dashboard, suite, config) {

  suite = Mocha.Suite.create(suite, dashboard.title + ' - ' + config.baseUrl + dashboard.slug);

  suite.beforeAll(function () {
    return browser.get(config.baseUrl + dashboard.slug)
      .$('body.ready', 5000)
      // if a dashboard isn't ready after 5s then there's probably a failed module
      // run module tests to help establish which
      .fail(function () {})
      .then(function () {
        if (config.screenshots) {
          return browser.screenshot(config.screenshots + '/' + dashboard.slug + '.png').fail(function (err) {
            if (err.code === 'ENOENT') {
              throw new Error('Screenshot directory ' + config.screenshots + ' does not exist.');
            } else {
              throw err;
            }
          });
        }
      });
  });

  var tests = {
    exists: function exists() {
      return browser
        .title()
          .should.eventually.contain(dashboard.strapline + ' - ' + dashboard.title)
        .$('h1').text()
          .should.eventually.contain(dashboard.strapline + '\n' + dashboard.title)
        .$('body.ready')
          .should.eventually.exist;
    }

  };

  _.each(tests, function (test, key) {
    suite.addTest(new Mocha.Test(key, test));
  });

  if (dashboard['dashboard-type'].indexOf('transaction') > -1) {
    require('./dashboards/transaction')(browser, dashboard, suite, config);
  } else if (dashboard['dashboard-type'] === 'content') {
    require('./dashboards/content')(browser, dashboard, suite, config);
  }

  var modules = Mocha.Suite.create(suite, 'modules');
  dashboard.modules.forEach(function (module) {
    moduleTest(browser, module, modules, config);
  });

  return suite;

};
