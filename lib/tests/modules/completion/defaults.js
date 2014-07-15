module.exports = function (module) {

  module.period = module['data-source']['query-params'].period || 'week';
  module.duration = module['data-source']['query-params'].duration || {
    hour: 24,
    day: 30,
    week: 9,
    month: 12
  }[module.period];
  module.axes = module.axes || {};

};