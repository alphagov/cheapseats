var cp = require('child_process'),
    _ = require('underscore'),
    Q = require('q');

module.exports = function (config) {
  console.log('No server is defined. Starting test server...');
  console.log('Installing npm modules...');
  var server;
  var promise = Q.defer();
  var npm = cp.spawn('npm', ['install'], {
    cwd: config.path
  });
  npm.stdout.on('data', function () {
    process.stdout.write('.');
  });
  npm.on('exit', function (err) {
    if (err) { console.log('npm install exited with non-zero exit code:', err); promise.reject(); }
    console.log('\nnpm modules installed, running grunt...');
    var grunt = cp.spawn('grunt', ['build:development'], {
      cwd: config.path
    });
    grunt.stdout.on('data', function () {
      process.stdout.write('.');
    });
    grunt.on('exit', function (err) {
      if (err) { console.log('grunt exited with non-zero exit code:', err); promise.reject(); }
      console.log('\nGrunt complete...');
      var args = [];
      if (config.serverConfig) {
        _.each(config.serverConfig, function (val, key) {
          args.push('--' + key, val);
        });
      }
      server = cp.fork('app/server.js', args, {
        cwd: config.path,
        silent: true
      });
      server.listening = false;
      server.stdout.on('data', function (data) {
        var match = data.toString().match(/Express server listening on port ([0-9]+)/);
        if (match) {
          server.listening = true;
          console.log('Test server started at http://localhost:' + match[1]);
          promise.resolve({
            server: server,
            url: 'http://localhost:' + match[1] + '/performance/'
          });
        }
      });
      setTimeout(function () {
        if (!server.listening) {
          console.log('Test server timed out. Exiting...');
          promise.reject();
        }
      }, 10000);
    });
  });
  return promise.promise;
};