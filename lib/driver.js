var cp = require('child_process'),
    ps = require('ps-node'),
    Q = require('q'),
    debug = require('debug')('cheapseats'),
    phantomPath = require('phantomjs').path;

var webdriverProcess;

var driver = {

  init: function (browser, config) {
    return browser.init()
      .setWindowSize(config.browserWidth, config.browserHeight)
      .then(function () {
        process.stdout.write('\nConnected to webdriver server on port ' + config.port + '\n');
      }, function (err) {
        if (err.code === 'ECONNREFUSED') {
          var promise = Q.defer();
          ps.lookup({
            command: 'phantomjs',
            arguments: ['--webdriver', config.port]
          }, function (err, processes) {
            if (!processes.length) {
              process.stdout.write('No webdriver instance found on port ' + config.port + '. Starting phantomjs...');
              webdriverProcess = cp.spawn(phantomPath, ['--webdriver', config.port, '--ssl-protocol', 'tlsv1'], {
                stdio: 'ignore'
              });
            } else {
              process.stdout.write('.');
            }
            setTimeout(function () {
              promise.resolve();
            }, 2000);
          });
          return promise.promise.then(function () {
            return driver.init(browser, config);
          });
        } else {
          return Q.reject(err);
        }
      });

  },

  kill: function () {
    if (webdriverProcess) {
      webdriverProcess.kill();
      debug('Tearing down webdriver');
    }
  }

};

module.exports = driver;