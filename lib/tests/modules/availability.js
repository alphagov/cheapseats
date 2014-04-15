var Mocha = require('mocha'),
    _ = require('underscore');

module.exports = function (browser, module, suite /*, config*/) {

  var tests = {
    'has a page load time numerical output': function () {
      return browser
        .$('#' + module.slug + ' .impact-number.response-time strong')
          .text()
            .should.eventually.match(/^([0-9\.]+s)|(\(no data\))$/);

    },
    'has a page load time graph': require('./graph/components').stack(browser, '#' + module.slug + ' .response-time-graph'),
    'has a page load time table': function () {
      return browser
        .$('#' + module.slug + ' .response-time-graph .table-toggle a').click()
        .$('#' + module.slug + ' .response-time-graph .table-toggle table').isDisplayed()
          .should.eventually.be.ok
        .then(function () {
          return require('./table/components').headings(browser, '#' + module.slug + ' .response-time-graph', {
            x: module.axes.x,
            y: [ { label: 'Page load time' } ]
          })();
        });
    },
    'has an uptime time numerical output': function () {
      return browser
        .$('#' + module.slug + ' .impact-number.uptime strong')
          .text()
            .should.eventually.match(/^[0-9\.]+%$/);

    },
    'has an uptime time graph': require('./graph/components').stack(browser, '#' + module.slug + ' .uptime-graph'),
    'has an uptime time table': function () {
      return browser
        .$('#' + module.slug + ' .uptime-graph .table-toggle a').click()
        .$('#' + module.slug + ' .uptime-graph .table-toggle table').isDisplayed()
          .should.eventually.be.ok
        .then(function () {
          return require('./table/components').headings(browser, '#' + module.slug + ' .uptime-graph', {
            x: module.axes.x,
            y: [ { label: 'Uptime' } ]
          })();
        });
    }
  };

  _.each(tests, function (test, key) {
    suite.addTest(new Mocha.Test(key, test));
  });

};