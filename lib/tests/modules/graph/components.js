module.exports = {

  stack: function (browser, selector, index) {
    index = index || 0;
    return function () {
      var linePath;
      return browser
        .$(selector + ' svg .lines .line' + index)
          .should.eventually.exist
          .getAttribute('d').then(function (d) {
            linePath = d.split('M')[1];
          })
        .$(selector + ' svg .stacks .stack' + index)
          .should.eventually.exist
          .getAttribute('d').then(function (d) {
            // the line follows the top of the stack, so the line path should be a
            // substring of the stack path
            d.should.contain(linePath);
          });
    };
  }

};