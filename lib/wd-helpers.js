module.exports = function (wd, config) {

  wd.addPromiseChainMethod('$', function (selector, timeout) {
    timeout = timeout || config.slow;
    return this
      .waitForElementByCssSelector(selector, timeout)
      .elementByCssSelector(selector);
  });

};