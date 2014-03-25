var Q = require('q'),
    path = require('path'),
    rimraf = require('rimraf'),
    fs = require('fs'),
    git = require('nodegit'),
    _ = require('underscore');

var configs = {};

module.exports.init = function (config) {
  return function () {
    var deferred = Q.defer();

    rimraf(config.path, function() {
      console.log('Cloning Spotlight...');
      git.Repo.clone(config.repo, config.path, null, function(error, repo) {
        if (error) {
          deferred.reject(err);
        } else {
          repo.getMaster(function(error, commit) {
            if (error) {
              deferred.reject(err);
            } else {
              fs.readdir(config.path + config.stubDir, function (err, files) {
                if (err) {
                  deferred.reject(err);
                } else {
                  files.forEach(function (file) {
                    if (file.indexOf('.json') !== -1) {
                      configs[file] = require(config.path + config.stubDir + file);
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