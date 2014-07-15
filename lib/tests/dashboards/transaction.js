var Mocha = require('mocha'),
_ = require('underscore');

var footerTest = require('../footer');

module.exports = function (browser, dashboard, suite, config) {

  var tests = {

    'has a description': function () {
      return browser
        .$('#content header p.tagline').text()
          .should.eventually.equal('This dashboard shows information about how the ' + dashboard.title + ' service is currently performing.');
    },

    'has a breadcrumb': function () {
      return browser
        .$('#global-breadcrumb ol').isDisplayed()
          .should.eventually.be.ok
        .$('#global-breadcrumb ol li:nth-child(1) a').text()
          .should.eventually.equal('Performance')
        .$('#global-breadcrumb ol li:nth-child(1) a').getAttribute('href')
          .should.eventually.match(/\/performance$/)
        .then(function () {
          if (dashboard.department) {
            return browser
              .$('#global-breadcrumb ol li:nth-child(2)').text()
                .should.eventually.contain(dashboard.department.title.substr(0, 32))
              .then(function () {
                if (dashboard.agency) {
                  return browser
                    .$('#global-breadcrumb ol li:nth-child(3)').text()
                      .should.eventually.contain(dashboard.agency.title.substr(0, 32));
                }
              });
          }
        });

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
