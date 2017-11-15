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

    getDashboardsList(config, function (dashboardsList) {
      downloadDashboards(dashboardsList, config).then(function () {
        glob(config.downloadFolder + config.stubGlob, function (err, files) {
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
    });

    return deferred.promise;
  };
};

function getDashboardsList(config, callback) {
  if (config.quickRun) {
    callback(config.dashboardSlugs);
  } else {
    request({
      url: config.dashboardsUrl,
      maxAttempts: 5,
      retryDelay: 1000,
      retryStrategy: retryStrategy, // (default) retry on 5xx or network errors
      json: true
    }, function (err, res, body) {
      if (err) {
        throw(err);
      } else {
        callback( _.pluck(body.items, 'slug'));
      }
    });
  }
}

function downloadSingleDashboard (dashboardsUrl, dashboardList, count, path, deferred) {
  var slug = dashboardList[count],
    total = dashboardList.length;

  console.info('Downloading dashboard for:', slug);
  request({
      url: dashboardsUrl + '?slug=' + slug,
      maxAttempts: 5,
      retryDelay: 1000,
      retryStrategy: retryStrategy, // (default) retry on 5xx or network errors
      json: true
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
        downloadSingleDashboard(dashboardsUrl, dashboardList, count, path, deferred);
      }
    }).pipe(
    fs.createWriteStream(path + slug + '.json')
  );
  return deferred.promise;
}

function retryStrategy (err, response) {
  console.log('response.statusCode', response.statusCode);
  request.RetryStrategies.HTTPOrNetworkError.apply(this, arguments);
}

function downloadDashboards (dashboardList, config) {
  var deferred = Q.defer();

  rimraf(config.downloadFolder, function () {
    fs.mkdir(config.downloadFolder, function () {
      var count = 0;
      downloadSingleDashboard(config.dashboardsUrl, dashboardList, count, config.downloadFolder, deferred)
        .then(function () {
          deferred.resolve();
        });
    });
  });

  return deferred.promise;
}

module.exports.dashboards = function (dashboard) {
  return Q(_.filter(configs, function (json) {
    var dashboard_condition = typeof dashboard === 'undefined' ? true : json['slug'] === dashboard;
    return (json['page-type'] === 'dashboard') && dashboard_condition;
  }));
};
