var _ = require('underscore');

module.exports = {

  line: function (browser, selector, index) {
    var lineInGroup = _.isNumber(index) ? '.group' + index : '';
    return function () {
      return browser
        .$(selector + ' svg .line' + lineInGroup)
          .should.eventually.exist;
    };
  },

  stack: function (browser, selector, index) {
    var lineInGroup = _.isNumber(index) ? '.group' + index : '';
    return function () {
      var linePath;
      return browser
        .$(selector + ' svg .line' + lineInGroup)
          .should.eventually.exist
          .getAttribute('d').then(function (d) {
            linePath = d.split('M')[1];
          })
        .$(selector + ' svg .stack' + lineInGroup)
          .should.eventually.exist
          .getAttribute('d').then(function (d) {
            // the line follows the top of the stack, so the line path should be a
            // substring of the stack path
            d.should.contain(linePath);
          });
    };
  }

};