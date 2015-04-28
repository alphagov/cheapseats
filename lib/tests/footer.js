var Mocha = require('mocha-extra-shot'),
    _ = require('underscore');

module.exports = function (browser, dashboard, suite/*, config*/) {

  var tests = {
    exists: function () {
      return browser
        .$('#content footer').isDisplayed()
          .should.eventually.be.ok;
    },

    'has a link to the service': function () {
      if (dashboard.relatedPages && dashboard.relatedPages.transaction) {
        return browser
          .$('#content footer .related-pages .related-transaction a').text()
            .should.eventually.equal(dashboard.relatedPages.transaction.title)
          .$('#content footer .related-pages .related-transaction a').getAttribute('href')
            .should.eventually.equal(dashboard.relatedPages.transaction.url);
      }
    },

    'has agency information': function () {
      if (dashboard.agency) {
        return browser
          .$('#content footer').text()
            .should.eventually.contain('Other department or public body:\n' + dashboard.agency.title);
      }
    },

    'has department information': function () {
      if (dashboard.department) {
        return browser
          .$('#content footer').text()
            .should.eventually.contain('Ministerial department:\n' + dashboard.department.title);
      }
    },

    'has user information': function () {
      if (dashboard['customer-type']) {
        return browser
          .$('#content footer').text()
            .should.eventually.contain('User:\n' + dashboard['customer-type']);
      }
    }

  };

  _.each(tests, function (test, key) {
    suite.addTest(new Mocha.Test(key, test));
  });

  return suite;

};
