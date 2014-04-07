# Cheapseats #

Dynamic functional test suite for spotlight using webdriver and mocha.

Cheapseats is designed build functional tests against the dashboards defined in [spotlight](https://github.com/alphagov/spotlight) and test them using webdriver.

It does this by building tests based on spotlight json dashboards.


## Installing ##

By default cheapseats runs against phantomjs on port 5555. You will need to [install phantom](http://phantomjs.org/download.html) (`brew update && brew install phantomjs`).

Ensure you follow the [nodegit](https://github.com/nodegit/nodegit) install instructions.

For everything else ```npm install``` will suffice.

## Running ##

```npm start```

you can also configure it with command line args for example

```node index.js --reporter nyan --port 4444```

If the application doesn't start and you recieve the error ```Error: connect ECONNREFUSED``` check that you are running a webdriver (selenium, phantomjs, etc) on the correct port.

### Configuration ###

Common configuration options are listed below, these can be set in config.json, or when running from node directly as command line arguments:

* `--baseUrl` - the server to run tests against.
* `--standalone` - cheapseats will spin up its own instance of spotlight (and phantomj, if required) to run tests against, instead of using the server provided in `--baseUrl`.
* `--path` - cheapseats will look here for an instance of spotlight. If it finds an empty directory, it will clone spotlight/master into this directory.
* `--force` - will make cheapseats *always* clone spotlight into the path provided, overwriting anything in that directory. *Use with care*
* `--port` - the port on which cheapseats will look for a webdriver compatible interface (e.g. phantomjs, selenium). By default phantomjs will run on 5555 and selenium will run on 4444. Note that standalone mode will *always* attempt to start phantomjs on the port specified if no instance is found.
* `--grep, --timeout, --slow, --reporter` - options passed to mocha. See http://visionmedia.github.io/mocha/#usage for usage.

## Standalone mode ##

If no baseUrl is set in the configuration, or the `--standalone` arguments is provided then cheapseats will start the services it needs to run.

This includes an instance of spotlight, with configuration options provided in config.json `serverConfig` property, and phantomjs on port 5555.

