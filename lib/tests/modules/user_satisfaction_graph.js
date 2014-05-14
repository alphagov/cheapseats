module.exports = function (browser, module, suite, config) {

  module.axes = module.axes || {};

  module.axes.x = module.axes.x || {
    label: 'Date'
  };
  module.axes.y = module.axes.y || [
    {
      label: 'User satisfaction'
    }
  ];

  require('./completion_rate')(browser, module, suite, config);
};