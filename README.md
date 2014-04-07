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

## Standalone mode ##

If no baseUrl is set in the configuration, or the `--standalone` arguments is provided then cheapseats will start the services it needs to run.

This includes an instance of spotlight, with configuration options provided in config.json `serverConfig` property, and phantomjs on port 5555.

