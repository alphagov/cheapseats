
var Mocha = require('mocha-extra-shot'),
_ = require('underscore');

module.exports = function (browser, dashboard, suite /*, config*/) {

  var tests = {

    'has a breadcrumb': function () {
      return browser
        .$('#global-breadcrumb ol').isDisplayed()
          .should.eventually.be.ok
        .$('#global-breadcrumb ol li:nth-child(1) a').text()
          .should.eventually.equal('Performance')
        .$('#global-breadcrumb ol li:nth-child(1) a').getAttribute('href')
          .should.eventually.match(/\/performance$/)
        .$('#global-breadcrumb ol li:nth-child(2)').text()
          .should.eventually.equal('Activity on GOV.UK')
        .then(function () {
          if (dashboard.slug !== 'site-activity') {
            return browser
              .$('#global-breadcrumb ol li:nth-child(3)').text()
                .should.eventually.contain(dashboard.title.substr(0, 32));
          }
        });

    },

    'has a link to the site in the header': function () {
      if (dashboard.relatedPages && dashboard.relatedPages.transaction) {
        return browser
          .$('#content .related-pages .related-transaction a').text()
            .should.eventually.equal(dashboard.relatedPages.transaction.title)
          .$('#content .related-pages .related-transaction a').getAttribute('href')
            .should.eventually.equal(dashboard.relatedPages.transaction.url);
      }
    }

  };

  _.each(tests, function (test, key) {
    suite.addTest(new Mocha.Test(key, test));
  });

  return suite;

};
