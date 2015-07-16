
var Mocha = require('mocha-extra-shot'),
_ = require('underscore');

module.exports = function (browser, dashboard, suite /*, config*/) {

  var tests = {

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
