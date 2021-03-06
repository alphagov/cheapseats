var Mocha = require('mocha'),
    _ = require('underscore');

module.exports = function (browser, module, suite, config) {

  var tests = {
    'has tabs': function () {
      return browser
        .$('#' + module.slug + ' nav[role="navigation"]')
          .should.eventually.exist
        .elementsByCssSelector('#' + module.slug + ' nav[role="navigation"] ol li').then(function (elements) {
          elements.length.should.equal(module.tabs.length);
        })
        .elementsByCssSelector('#' + module.slug + ' .visualisation section').then(function (elements) {
          elements.length.should.equal(module.tabs.length);
        });
    },
    'selected tab content is visible': function () {
      var index = module.activeIndex || 0;
      return browser
        .$('#' + module.slug + ' .visualisation nav[role="navigation"] ol li:nth-child(' + (index + 1) + ').active').text()
          .should.eventually.equal(module.tabs[index].title)
        .$('#' + module.slug + ' .visualisation section:nth-of-type(' + (index + 1) + ')').isDisplayed()
          .should.eventually.be.ok;
    }
  };

  _.each(tests, function (test, key) {
    suite.addTest(new Mocha.Test(key, test));
  });

  _.each(module.tabs, function (tab, i) {
    tab.slug = module.slug + '-' + tab.slug;
    var moduleTests = require('../module')(browser, tab, suite, config, {
      'has a title': function () {
        return browser
          .$('#' + tab.slug + ' h2').isDisplayed()
            .should.eventually.equal(false);
      }
    });

    moduleTests.beforeAll(function () {
      return browser
        .$('#' + module.slug + ' .visualisation nav[role="navigation"] ol li:nth-child(' + (i + 1) + ') a').click();
    });

  });

};
