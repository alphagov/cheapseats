var Mocha = require('mocha'),
    _ = require('underscore');

module.exports = function (browser, module, suite /*, config*/) {

  var tests = {
    'has a title': function () {
      return browser
        .$('#' + module.slug + ' h2').text()
          .should.become(module.title);
    },

    'has a realtime value': function () {
      return browser
        .$('#' + module.slug + ' .stat strong').text()
          .should.eventually.match(/^([0-9\.]+[b,m,k]?)|(no data)$/);
    },

    'has a graph': function () {
      return browser
        .$('#' + module.slug + ' .sparkline')
          .should.eventually.exist;
    }
  };

  _.each(tests, function (test, key) {
    suite.addTest(new Mocha.Test(key, test));
  });

};
