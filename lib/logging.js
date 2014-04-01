var debug = require('debug')('cheapseats');

module.exports = function (browser) {
  browser.on('status', function (info) {
    debug(info.cyan);
  });
  browser.on('command', function (eventType, command, response) {
    debug(eventType.cyan, command, (response || '').grey);
  });
  browser.on('http', function (meth, path, data) {
    debug(meth.magenta, path, (data || '').grey);
  });
};