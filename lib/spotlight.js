var Q = require('q'),
    rimraf = require('rimraf'),
    fs = require('fs'),
    _ = require('underscore'),
    glob = require('glob'),
    request = require('requestretry');

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
    })
    .catch(function (err) {
      deferred.reject(err);
    });

    return deferred.promise;
  };
};

function downloadSingleDashboard(dashboards, count, path, deferred){
  var slug = dashboards[count].slug,
    total = dashboards.length;

  console.info('Downloading dashboard for:', slug);
  request({
      url: 'https://stagecraft.production.performance.service.gov.uk/public/dashboards?slug=' + slug,
      maxAttempts: 5,
      retryDelay: 1000,
      retryStrategy: request.RetryStrategies.HTTPOrNetworkError // (default) retry on 5xx or network errors
    },
    function (err, response /*, body*/) {
      if (err) {
        deferred.reject(err);
      }
      if (response && 500 <= response.statusCode && response.statusCode < 600) {
        deferred.reject(new Error("Server returned " + response.statusCode + ". Response body was saved."));
      }
      count++;
      if (count === total) {
        deferred.resolve();
      } else {
        downloadSingleDashboard(dashboards, count, path, deferred);
      }
    }).pipe(
      fs.createWriteStream(path + slug + '.json')
    );
  return deferred.promise
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
            downloadSingleDashboard(config.dashboard, path)
            .then(function () {
              deferred.resolve();
            })
            .catch(function (err) {
              deferred.reject(err);
            });
          } else {
            body = JSON.parse(body);
            var count = 0;

            downloadSingleDashboard(body.items, count, path, deferred)
              .then(function() {
                deferred.resolve();
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
