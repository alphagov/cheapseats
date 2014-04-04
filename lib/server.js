var cp = require('child_process'),
    _ = require('underscore'),
    Q = require('q'),
    debug = require('debug')('cheapseats');

function npm(config) {
  return childProcess(config, 'npm', ['install']);
}

function grunt(config) {
  return childProcess(config, 'grunt', ['build:development']);
}

function childProcess(config, bin, args) {
  return function () {
    process.stdout.write(bin + ' ' + args.join(' ') + '...');
    var promise = Q.defer();
    var child = cp.spawn(bin, args, {
      cwd: config.path
    });
    stdio(child);
    child.on('exit', function (err) {
      if (err) {
        console.log(bin + ' ' + args.join(' ') + ' exited with non-zero exit code:', err);
        promise.reject();
      }
      else {
        console.log('\n');
        promise.resolve();
      }
    });
    return promise.promise;
  };
}

function stdio(child) {
  child.stdout.on('data', function (data) {
    debug(data.toString());
    process.stdout.write('.');
  });
}

function server(config) {
  return function () {
    process.stdout.write('Starting server...');
    var promise = Q.defer();
    var args = [];
    if (config.serverConfig) {
      _.each(config.serverConfig, function (val, key) {
        args.push('--' + key, val);
      });
    }
    var child = cp.fork('app/server.js', args, {
      cwd: config.path,
      silent: true
    });
    child.listening = false;
    child.stdout.on('data', function (data) {
      debug(data.toString());
      if (!child.listening) { process.stdout.write('.'); }
      var match = data.toString().match(/Express server listening on port ([0-9]+)/);
      if (match) {
        child.listening = true;
        console.log('\nTest server started at http://localhost:' + match[1]);
        promise.resolve({
          server: child,
          url: 'http://localhost:' + match[1] + '/performance/'
        });
      }
    });
    setTimeout(function () {
      if (!child.listening) {
        console.log('Test server timed out. Exiting...');
        promise.reject();
      }
    }, 10000);
    return promise.promise;
  };
}

module.exports = function (config) {
  console.log('No server is defined. Creating standalone server...');
  return npm(config)()
    .then(grunt(config))
    .then(server(config));
};