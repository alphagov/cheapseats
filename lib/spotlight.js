var Q = require('q'),
    rimraf = require('rimraf'),
    fs = require('fs'),
    _ = require('underscore'),
    glob = require('glob'),
    request = require('request');

var configs = {};

module.exports.init = function (config) {
  return function () {
    var deferred = Q.defer();

    downloadDashboards(config).then(function () {
      glob(config.dashboardPath + config.stubGlob, function (err, files) {
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

function downloadDashboards(config) {
  var deferred = Q.defer(),
      path = config.dashboardPath;

  request(config.dashboardList, function (err, res, body) {
    if (err) {
      deferred.reject(err);
    } else {
      body = JSON.parse(body);
      var total = body.items.length;
      var count = 0;
      rimraf(path, function () {
        fs.mkdir(path, function () {
          body.items.forEach(function (dashboard) {
            console.log('Downloading dashboard for:', dashboard.slug);
            request(config.dashboardList + '?slug=' + dashboard.slug)
              .pipe(fs.createWriteStream(path + dashboard.slug + '.json'))
              .on('error', function (err) {
                deferred.reject(err);
              })
              .on('finish', function () {
                count++;

                if (count === total) {
                  deferred.resolve();
                }
              });
          });
        });
      });
    }
  });

  return deferred.promise;
}

module.exports.dashboards = function () {
  return Q(_.filter(configs, function (json) {
    return json['page-type'] === 'dashboard';
  }));
};
