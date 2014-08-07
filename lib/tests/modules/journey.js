var Mocha = require('mocha-extra-shot'),
    _ = require('underscore');

module.exports = function (browser, module, suite, config) {

  var tests = {
    'has a title': function () {
      return browser
        .$('#' + module.slug + ' h2').text()
          .should.eventually.equal(module.title);
    },

    'has a description': function () {
      return browser
        .$('#' + module.slug + ' > p').text()
          .should.eventually.equal(module.description);
    },

    'has bars for the journey steps': function () {
      return browser
        .elementsByCssSelector('#' + module.slug + ' svg .bar .segment').then(function (bars) {
          bars.length.should.equal(module.axes.y.length);
        });
    },

    'bars have labels for each step': function () {
      return browser
        .each('#' + module.slug + ' svg .x-axis .tick text', function (bar, i) {
          return bar.text().then(function (text) {
            // text can be truncated with an ellipsis
            module.axes.y[i].label.should.contain(text.replace(/…$/, ''));
          });
        });
    },

    'bars have value labels': function () {
      return browser
        .each('#' + module.slug + ' svg .bar .segment text', function (bar) {
          return bar.text().should.eventually.match(config.valueRegex);
        });
    },

    'has a callout, hidden by default': function () {
      return browser
        .$('#' + module.slug + ' .callout')
          .should.eventually.exist
          .isDisplayed()
            .should.eventually.equal(false);
    }/*,
    // This test fails because of phantomjs/ghostdrivers lack of support for moveTo/mousemove events
    // This may be rectified in future phantom releases
    'mousing over bars displays callout': function () {
      return browser
        .each('#' + module.slug + ' svg .bar .segment', function (bar, i) {
          return bar.moveTo()
            .then(function () {
              return browser
                .$('#' + module.slug + ' .callout').isDisplayed()
                  .should.eventually.equal(true)
                .$('#' + module.slug + ' .callout h3').text()
                  .should.eventually.contain('Stage: ' + module.axes.y[i].label);
            });
        });
    }*/

  };

  _.each(tests, function (test, key) {
    suite.addTest(new Mocha.Test(key, test));
  });

};
