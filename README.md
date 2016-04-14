# MPS Customer Portal 2.0

* [MPS 2.0 Best Practices Guide](https://github.com/LexmarkWeb/mps-ui/wiki)

To run locally with gulp
 * `cd src`
 * `npm update`
 * `gulp dev`
 * Website is: http://localhost:8080/
 * To change which environment is used (see src/client/config/*.json), use:
    `MPS_ENV=beta gulp dev`

To test via console
 * `cd src`
 * `npm update`
 * `npm test`

These are no longer stored as environment variables. They are injected to index.html during Gulp build.
See src/client/config/*.json files, src/client/views/index.html, and gulpfile.js for more information. See
Gulp task `prep-html` for more information.
Environmental Variables
   * NEWRELICID=10059346   --NewRelic Browser
   * NEW_RELIC_LICENSE_KEY=0ce62264499457b6bb48fc18ed2ee650deeb6e2e  --NewRelic Docker Container for Node.js
   * NEW_RELIC_APP_NAME=MPS-DEV   --Name of the NewRelic Application in their system
   * NEW_RELIC_BROWSER_MONITOR_ENABLE=true --Turn on Broswer data capture
   * NEW_RELIC_CAPTURE_PARAMS=true  
   * NEW_RELIC_LOG_LEVEL=info
   * NEW_RELIC_ENABLED=true --enable/disabled newrelic for this docker image
   * NEW_RELIC_TRACER_ENABLED=true
