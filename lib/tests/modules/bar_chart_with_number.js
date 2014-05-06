var Mocha = require('mocha'),
    _ = require('underscore');

module.exports = function (browser, module, suite, config) {

  function isDatePeriod(str) {
    var dates = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var containsTwoMonthNames = (_.intersection(dates, str.replace(/\n/g, ' ').split(' ')).length === 2);
    return containsTwoMonthNames;
  }

  var tests = {
    'has a title': function () {
      return browser
        .$('#' + module.slug + ' h2').text()
          .should.eventually.equal(module.title);
    },

    'has a description': function () {
      return browser
        .$('#' + module.slug + ' h3').text()
          .should.eventually.equal(module.description);
    },

    'has 5 bars for quarters': function () {
      return browser
        .elementsByCssSelector('#' + module.slug + ' svg .bar .segment').then(function (bars) {
          bars.length.should.equal(5);
        });
    },

    'bars have labels for each time period': function () {
      return browser
        .each('#' + module.slug + ' svg .x-axis .tick text', function (bar) {
          return bar.text().then(function (text) {
            isDatePeriod(text).should.be.true;
          });
        });
    },

    'bars have value labels': function () {
      return browser
        .each('#' + module.slug + ' svg .bar .segment text', function (bar) {
          return bar.text().should.eventually.match(config.valueRegex);
        });
    },

    'has a headline number': function () {
      return browser
        .$('#' + module.slug + ' .impact-number > *').text()
        .should.eventually.match(config.valueRegex);
    },

    'has a headline date period': function () {
      return browser
        .each('#' + module.slug + ' .impact-number', function (value) {
          return value.text().then(function (text) {
            if (text.indexOf('no data') === -1) {
              isDatePeriod(text).should.be.true;
            }
          });
        });
    }

  };

  _.each(tests, function (test, key) {
    suite.addTest(new Mocha.Test(key, test));
  });

};
