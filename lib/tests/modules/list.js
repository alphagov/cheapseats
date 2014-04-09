var Mocha = require('mocha'),
    _ = require('underscore');

module.exports = function (browser, module, suite /*, config*/) {

  var tests = {

    'has a description': function () {
      return browser
        .$('#' + module.slug + ' h3').text()
          .should.eventually.equal(module.description);
    },

    'contains list items': function () {
      return browser
        .elementsByCssSelector('#' + module.slug + ' ol li').then(function (elems) {
          elems.length.should.equal(module['query-params'].limit);
        });
    }

  };

  _.each(tests, function (test, key) {
    suite.addTest(new Mocha.Test(key, test));
  });

};
