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
    'has an uptime time numerical output': function () {
      return browser
        .$('#' + module.slug + ' .impact-number.uptime strong')
          .text()
            .should.eventually.match(/^[0-9\.]+%$/);

    },
    'has an uptime time graph': require('./graph/components').stack(browser, '#' + module.slug + ' .uptime-graph'),
    'has a table showing uptime and load time': function () {
      return browser
        .$('#' + module.slug + ' .visualisation .visualisation-table .table-toggle a').click()
        .$('#' + module.slug + ' .visualisation .visualisation-table .table-toggle table').isDisplayed()
          .should.eventually.be.ok
        .then(function () {
          return require('./table/components').headings(browser, '#' + module.slug + ' .visualisation-table', {
            x: module.axes.x,
            y: [ { label: 'Page load time' }, { label: 'Uptime' } ]
          })();
        });
    }
  };

  _.each(tests, function (test, key) {
    suite.addTest(new Mocha.Test(key, test));
  });

};