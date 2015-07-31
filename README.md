# MPS Customer Portal 2.0

* [MPS 2.0 Best Practices Guide](https://github.com/LexmarkWeb/mps-ui/wiki)

To run locally with docker
 * Install docker for your platform
 * Install and configure docker-compose (will vary by platform)
 * `docker-compose up`
 * Navigate to http://localhost:8080/

To run locally withhout docker
 * `cd src`
 * `npm update`
 * `npm start`
 * Website is: http://localhost:8080/

To test via console
 * `cd src`
 * `npm update`
 * `npm test`

To test via web
 * Start the server
 * Navigate to http://localhost:8080/test

Environmental Variables
   * NEWRELICID=10059346   --NewRelic Browser
   * NEW_RELIC_LICENSE_KEY=0ce62264499457b6bb48fc18ed2ee650deeb6e2e  --NewRelic Docker Container for Node.js
   * NEW_RELIC_APP_NAME=MPS-DEV   --Name of the NewRelic Application in their system
   * NEW_RELIC_BROWSER_MONITOR_ENABLE=true --Turn on Broswer data capture
   * NEW_RELIC_CAPTURE_PARAMS=true  
   * NEW_RELIC_LOG_LEVEL=info
   * NEW_RELIC_ENABLED=true --enable/disabled newrelic for this docker image
   * NEW_RELIC_TRACER_ENABLED=true
