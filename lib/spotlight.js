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

function downloadSingleDashboard(slug, path){
  console.info('Downloading dashboard for:', slug);
  return request(
    'https://stagecraft.production.performance.service.gov.uk/public/dashboards?slug=' + slug)
    .pipe(
      fs.createWriteStream(path + slug + '.json')
    );
}

function downloadDashboards(config) {
  var deferred = Q.defer(),
      path = config.dashboardPath,
      dashboardsRequest = config.dashboard ? config.dashboardList + '?slug=' + config.dashboard : config.dashboardList;

  request(dashboardsRequest, function (err, res, body) {
    if (err) {
      deferred.reject(err);
    } else {
      rimraf(path, function () {
        fs.mkdir(path, function () {
          if(config.dashboard){
            downloadSingleDashboard(config.dashboard, path).on('finish', function () {
              deferred.resolve();
            });
          } else {
            body = JSON.parse(body);
            var total = body.items.length;
            var count = 0;

            body.items.forEach(function (dashboard) {
              var dashboardDL = downloadSingleDashboard(dashboard.slug, path);
              dashboardDL.on('finish', function () {
                count++;

                if (count === total) {
                  deferred.resolve();
                }
              });
            });
          }
        });
      });
    }
  });

  return deferred.promise;
}

module.exports.dashboards = function (dashboard) {
  return Q(_.filter(configs, function (json) {
    var dashboard_condition = typeof dashboard === 'undefined' ? true : json['slug'] === dashboard;
    return (json['page-type'] === 'dashboard') && dashboard_condition;
  }));
};
