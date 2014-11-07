# Cheapseats #

Dynamic functional test suite for spotlight using webdriver and mocha.

Cheapseats is designed build functional tests against the dashboards defined in [spotlight](https://github.com/alphagov/spotlight) and test them using webdriver.

It does this by building tests based on spotlight json dashboards.


## Installing ##

```npm install```

Ensure you follow the [nodegit](https://github.com/nodegit/nodegit) install instructions.

## Running ##

`./cheapseats`

you can also configure it with command line args for example

```./cheapseats --reporter nyan --port 4444```

If the application doesn't start and you recieve the error ```Error: connect ECONNREFUSED``` check that you are running a webdriver (selenium, phantomjs, etc) on the correct port.

### Configuration ###

Common configuration options are listed below, these can be set in config.json, or when running from node directly as command line arguments:

* `--baseUrl` - the server to run tests against.
* `--standalone` - cheapseats will spin up its own instance of spotlight (and phantomj, if required) to run tests against, instead of using the server provided in `--baseUrl`.
* `--screenshots` - directory to save a screenshot of each dashboard into. A falsy value will disable screenshots.
* `--path` - cheapseats will look here for an instance of spotlight.
* `--force` - will make cheapseats *always* clone spotlight into the path provided, overwriting anything in that directory. *Use with care*
* `--dashboardList` - The stagecraft environment to download the dashboards from default is production.
* `--port` - the port on which cheapseats will look for a webdriver compatible interface (e.g. phantomjs, selenium). By default phantomjs will run on 5555 and selenium will run on 4444. Note that standalone mode will *always* attempt to start phantomjs on the port specified if no instance is found.
* `--browserWidth`, `--browserHeight` - the dimensions of the browser window used to test the site.
* `--grep`, `--timeout`, `--slow`, `--reporter` - options passed to mocha. See http://mochajs.github.io/mocha/#usage for usage.
* `--unpublished` - will run cheapseats against the unpublished dashboards

## Standalone mode ##

If no baseUrl is set in the configuration, or the `--standalone` argument is provided then cheapseats will start the services it needs to run.

This includes an instance of spotlight, with configuration options provided in config.json `serverConfig` property, and phantomjs on port 5555.

