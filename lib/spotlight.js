var Q = require('q'),
    rimraf = require('rimraf'),
    fs = require('fs'),
    git = require('nodegit'),
    _ = require('underscore');

var configs = {};

module.exports.init = function (config) {
  return function () {
    var deferred = Q.defer(),
        path = require('path').resolve(__dirname, process.cwd(), config.path);

    rimraf(config.path, function () {
      console.log('Cloning Spotlight...');
      git.Repo.clone(config.repo, config.path, null, function (error, repo) {
        if (error) {
          deferred.reject(error);
        } else {
          repo.getMaster(function (error) {
            if (error) {
              deferred.reject(error);
            } else {
              fs.readdir(config.path + config.stubDir, function (err, files) {
                if (err) {
                  deferred.reject(err);
                } else {
                  files.forEach(function (file) {
                    if (file.indexOf('.json') !== -1 && config.ignore.indexOf(file) === -1) {
                      configs[file] = require(path + config.stubDir + file);
                    }
                  });
                  deferred.resolve();
                }
              });
            }
          });
        }
      });
    });

    return deferred.promise;
  };
};

module.exports.dashboards = function () {
  return Q(_.filter(configs, function (json) {
    return json['page-type'] === 'dashboard';
  }));
};