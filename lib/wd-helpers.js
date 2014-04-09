var Q = require('q'),
    _ = require('underscore');

module.exports = function (wd, config) {

  wd.addPromiseChainMethod('$', function (selector, timeout) {
    timeout = timeout || config.slow;
    return this
      .waitForElementByCssSelector(selector, timeout)
      .elementByCssSelector(selector);
  });

  wd.addPromiseChainMethod('each', function (selector, iterator) {
    return this.elementsByCssSelector(selector).then(function (elems) {
      var promise = Q();
      elems.length.should.be.gt(0);
      _.each(elems, function (elem, i) {
        promise = promise.then(function () {
          return iterator(elem, i, elems);
        });
      });
      return promise;
    });
  });

};