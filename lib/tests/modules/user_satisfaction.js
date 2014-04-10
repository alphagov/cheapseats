var Mocha = require('mocha'),
    _ = require('underscore');

module.exports = function (browser, module, suite /*, config*/) {

  var tests = {

    'has a description': function () {
      return browser
        .$('#' + module.slug + ' h3').text()
          .should.eventually.equal(module.description);
    },

    'has a percentage value': function () {
      return browser
        .$('#' + module.slug + ' .stat strong').text()
          .should.eventually.match(/^([0-9\.]+%)|(no data)$/);
    },

    'has a delta value': function () {
      return browser
        .$('#' + module.slug + ' .delta .impact-number').text()
          // this regex may look odd, but one is hyphen, the other is \u2212
          // http://www.fileformat.info/info/unicode/char/2212/index.htm
          .should.eventually.match(/^((-|−)?[0-9\.]+%)|(no change)$/);
    }

  };

  _.each(tests, function (test, key) {
    suite.addTest(new Mocha.Test(key, test));
  });

};