module.exports = function (browser, dashboard, baseUrl) {
  return function () {
    return browser.get(baseUrl + dashboard.slug)
      .title()
        .should.become(dashboard.title + ' - ' + dashboard.strapline + ' - GOV.UK')
      .elementByCssSelector('h1')
      .text()
        .should.eventually.equal(dashboard.strapline + '\n' + dashboard.title);
  };
};