module.exports = {

  headings: function (browser, selector, axes) {
    return function () {
      return browser
        .each(selector + ' table thead th', function (th, i) {
          if (i) {
            return th.text().should.eventually.contain(axes.y[i - 1].label);
          } else {
            return th.text().should.eventually.equal(axes.x.label);
          }
        });
    };
  },
  rows: function (browser, selector, axes) {
    return function () {
      return browser
        .each(selector + ' table tbody tr', function (tr) {
          tr.elementsByCssSelector('td').then(function (tds) {
            tds.length.should.equal(axes.y.length + 1);
          });
        });
    };
  }

};