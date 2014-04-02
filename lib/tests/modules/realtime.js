var Mocha = require('mocha'),
    _ = require('underscore');

module.exports = function (browser, module, suite /*, config*/) {

  module.axes = module.axes || {};
  module.axes.x = module.axes.x || {
    label: 'Time',
    key: '_timestamp',
    format: 'time'
  };
  module.axes.y = module.axes.y || [
    {
      label: 'Number of unique visitors',
      key: 'unique_visitors',
      format: 'integer'
    }
  ];

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

  if (!module.classes || (module.classes !== 'cols2' && module.classes[0] !== 'cols2')) {
    require('./graph/table').apply(null, arguments);
  }

};
