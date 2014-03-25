module.exports = function (browser, module, baseUrl) {
  return function () {
    return browser
      .elementByCssSelector('#' + module.slug)
        .should.eventually.exist;
  };
};