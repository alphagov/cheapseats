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
      var format = module['format-options'] || {};
      var matcher = format.type === 'duration' ? config.durationRegex : config.valueRegex;
      return browser
        .$('#' + module.slug + ' .impact-number strong')
          .text()
            .should.eventually.match(matcher);

    },
    'has a headline date period': function () {
      return browser
        .$('#' + module.slug + ' .impact-number .summary').text()
          .should.eventually.match(/(January|Febuary|March|April|May|June|July|August|September|October|November|December) (19[0-9]\d|2\d{3})/);
    }
  };

  require('./graph').apply(null, arguments);
  require('./completion/graph').apply(null, arguments);

  _.each(tests, function (test, key) {
    suite.addTest(new Mocha.Test(key, test));
  });

};
