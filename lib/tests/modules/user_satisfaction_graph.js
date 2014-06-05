module.exports = function (browser, module, suite, config) {

  module.axes = module.axes || {};

  module.axes.x = module.axes.x || {
    label: 'Date'
  };
  module.axes.y = module.axes.y || [
    { label: 'User satisfaction' },
    { label: 'Not satisfied' },
    { label: 'Dissatisfied' },
    { label: 'Neither satisfied or dissatisfied' },
    { label: 'Satisfied' },
    { label: 'Very satisfied' }
  ];

  module.trim = module.trim === undefined ? true : module.trim;

  require('./completion_rate')(browser, module, suite, config);
};