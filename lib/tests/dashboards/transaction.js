var Mocha = require('mocha'),
_ = require('underscore');

var footerTest = require('../footer');

module.exports = function (browser, dashboard, suite, config) {

  var tests = {

    'has a description': function () {
      if (dashboard.tagline) {
        return browser
          .$('#content header p.tagline').text()
            .should.eventually.equal(dashboard.tagline);
      } else {
        return browser
          .$('#content header p.tagline').text()
            .should.eventually.equal('This dashboard shows information about how the ' + dashboard.title + ' service is currently performing.');
      }
    },

    'has a link to the service page in the header': function () {
      if (dashboard.relatedPages && dashboard.relatedPages.transaction) {
        return browser
          .$('#content .related-pages .related-transaction a').text()
            .should.eventually.equal(dashboard.relatedPages.transaction.title)
          .$('#content .related-pages .related-transaction a').getAttribute('href')
            .should.eventually.equal(dashboard.relatedPages.transaction.url);
      }
    }

  };

  if (dashboard.published === false) {
    tests['has a prototype banner'] = function () {
      return browser.$('#unpublished-warning').isDisplayed().should.eventually.be.ok;
    };
  }

  _.each(tests, function (test, key) {
    suite.addTest(new Mocha.Test(key, test));
  });

  var footer = Mocha.Suite.create(suite, 'footer');
  footerTest(browser, dashboard, footer, config);

  return suite;

};
