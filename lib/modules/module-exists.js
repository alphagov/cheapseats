module.exports = function (browser, module) {
  return function () {
    return browser
      .elementByCssSelector('#' + module.slug)
        .should.eventually.exist;
  };
};