var Mocha = require('mocha'),
    _ = require('underscore');

module.exports = function (browser, module, suite, config) {

  require('./completion/defaults')(module);

  module.axes.x = module.axes.x || {
    label: 'Date of Application'
  };
  module.axes.y = module.axes.y || [
    {
      label: 'Number of applications'
    }
  ];

  var tests = {
    'has a numerical value': function () {
      return browser
        .$('#' + module.slug + ' .impact-number strong')
          .text()
            .should.eventually.match(config.valueRegex);

    },
    'has period output': function () {
      return browser
        .$('#' + module.slug + ' .impact-number').text()
          .should.eventually.contain('mean per ' + module.period + ' over the last ' + module.duration + ' ' + module.period + 's');
    }
  };

  require('./graph').apply(null, arguments);
  require('./completion/graph').apply(null, arguments);

  _.each(tests, function (test, key) {
    suite.addTest(new Mocha.Test(key, test));
  });

};
