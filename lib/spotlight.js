var Q = require('q'),
    rimraf = require('rimraf'),
    fs = require('fs'),
    _ = require('underscore'),
    glob = require('glob');

var configs = {};

module.exports.init = function (config) {
  return function () {
    var deferred = Q.defer(),
        path = require('path').resolve(__dirname, process.cwd(), config.path);

    init(config).then(function () {
      glob(config.path + config.stubGlob, function (err, files) {
        if (err) {
          deferred.reject(err);
        } else {
          files.forEach(function (file) {
            var dashboardPath = require('path').resolve(process.cwd(), file),
                dashboardFilename = require('path').basename(file),
                dashboardConfig = require(dashboardPath);

            if (config.ignore.indexOf(dashboardFilename) === -1 &&
                 dashboardConfig['page-type'] === 'dashboard' &&
                 (dashboardConfig['published'] || config.unpublished)) {
              configs[file] = dashboardConfig;
            }
          });
          deferred.resolve();
        }
      });
    });

    return deferred.promise;
  };
};

function init(config) {
  var deferred = Q.defer(),
      path = require('path').resolve(__dirname, process.cwd(), config.path);

  if (config.clone) {
    var git = require('nodegit');
    git.Repo.open(path, function (err) {
      if (err) {
        fs.readdir(path, function (err, files) {
          if (err) {
            if (err.code === 'ENOENT') {
              clone(config, deferred);
            } else {
              deferred.reject(err);
            }
          } else if (files.length && !config.force) {
            console.log(path + ' is not empty');
            console.log('To overwrite, use `--force`');
            deferred.reject();
          } else {
            clone(config, deferred);
          }
        });
      } else {
        if (!config.force) {
          console.log(config.repo + ' is already checked out in ' + path);
          console.log('To overwrite, use `--force`');
          deferred.resolve();
        } else {
          clone(config, deferred);
        }
      }
    });
  } else {
    deferred.resolve();
  }

  return deferred.promise;
}

function clone(config, deferred) {
  rimraf(config.path, function () {
    console.log('Cloning Spotlight...');
    git.Repo.clone(config.repo, config.path, null, function (err) {
      if (err) {
        deferred.reject(err);
      } else {
        deferred.resolve();
      }
    });
  });
}

module.exports.dashboards = function () {
  return Q(_.filter(configs, function (json) {
    return json['page-type'] === 'dashboard';
  }));
};
