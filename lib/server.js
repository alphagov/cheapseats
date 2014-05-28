var cp = require('child_process'),
    _ = require('underscore'),
    Q = require('q'),
    debug = require('debug')('cheapseats');

var serverProcess;

function npm(config) {
  return childProcess(config, 'npm', ['install']);
}

function grunt(config) {
  return childProcess(config, 'grunt', ['build:development']);
}

function childProcess(config, bin, args) {
  return function () {
    var promise = Q.defer();
    var child = cp.spawn(bin, args, {
      cwd: config.path
    });
    child.stdout.on('data', function (data) {
      debug(data.toString());
      process.stdout.write('.');
    });
    child.stderr.on('data', function (data) {
      debug(data.toString());
      process.stdout.write('.');
    });
    child.on('exit', function (err) {
      process.stdout.write('\n');
      if (err) {
        promise.reject(err);
      }
      else {
        promise.resolve();
      }
    });
    return promise.promise;
  };
}

function server(config) {
  return function () {
    var promise = Q.defer();
    var args = [];
    if (config.serverConfig) {
      _.each(config.serverConfig, function (val, key) {
        args.push('--' + key, val);
      });
    }
    serverProcess = cp.fork('app/server.js', args, {
      cwd: config.path,
      silent: true
    });
    serverProcess.listening = false;
    serverProcess.stdout.on('data', function (data) {
      debug(data.toString());
      if (!serverProcess.listening) { process.stdout.write(data); }
      var match = data.toString().match(/Express server listening on port ([0-9]+)/);
      if (match) {
        serverProcess.listening = true;
        console.log('\nTest server started at http://localhost:' + match[1]);
        config.baseUrl = 'http://localhost:' + match[1] + '/performance/';
        promise.resolve();
      }
    });
    serverProcess.stderr.on('data', function (data) {
      process.stderr.write(data);
    });
    setTimeout(function () {
      if (!serverProcess.listening) {
        console.log('Test server timed out. Exiting...');
        promise.reject();
      }
    }, 10000);
    return promise.promise;
  };
}

module.exports = {
  start: function (config) {
    process.stdout.write('Creating standalone server...');
    return npm(config)()
      .then(grunt(config))
      .then(server(config));
  },
  kill: function () {
    if (serverProcess) {
      debug('Tearing down standalone server');
      serverProcess.kill();
    }
  }
};