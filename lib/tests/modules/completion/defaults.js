module.exports = function (module) {

  module.period = module.period || 'week';
  module.duration = module.duration || {
    hour: 24,
    day: 30,
    week: 9,
    month: 12
  }[module.period];

};