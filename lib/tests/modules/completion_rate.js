var Mocha = require('mocha'),
    _ = require('underscore'),
    Q = require('q');

module.exports = function (browser, module, suite /*, config*/) {

  require('./completion/defaults')(module);

  module.axes.x = module.axes.x || {
    label: 'Date of completion'
  };
  module.axes.y = module.axes.y || [
    {
      label: 'Completion percentage'
    }
  ];

  var tests = {
    'has a percentage value': function () {
      return browser
        .$('#' + module.slug + ' .impact-number strong')
          .text()
            .should.eventually.match(/^[0-9]{1,2}%$/);

    },
    'has period output': function () {
      var regex;
      if (module.duration && !module['start-at']) {
        regex = new RegExp('last ' + module.duration + ' ' + module.period + 's');
      } else {
        regex = new RegExp('last [0-9]+ ' + module.period + 's');
      }
      return browser
        .$('#' + module.slug + ' .impact-number').text()
          .should.eventually.match(regex);
    },
    'has y-axis ticks at 0, 50, 100%': function () {
      return browser
        .elementsByCssSelector('#' + module.slug + ' svg .y-axis .tick text').then(function (ticks) {
          ticks.length.should.equal(3);
          return Q.all(_.map(ticks, function (tick, i) {
            return tick.text().should.eventually.equal(['0%', '50%', '100%'][i]);
          }));
        });
    }
  };

  if (module['data-group'] === 'student-finance' && module.slug === 'completion-rate') {
    delete tests['has y-axis ticks at 0, 50, 100%'];
    tests['cannot test y-axis for student finance due to faulty data'] = null;
    delete tests['has a percentage value'];
    tests['cannot test percentage values for student finance due to faulty data'] = null;
  }

  require('./graph').apply(null, arguments);
  require('./completion/graph').apply(null, arguments);

  _.each(tests, function (test, key) {
    suite.addTest(new Mocha.Test(key, test));
  });

};
