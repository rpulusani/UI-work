docker pull lexmarkweb/mps-ui
if [ "$DEPLOYMENT_GROUP_NAME" == "mps-ui-dev" ]
then
environmentVars="-e ENVIRONMENT=INTEGRATED -e NEWRELICID=10059346"
else
environmentVars="-e ENVIRONMENT=UNKNOWN -e NEWRELICID=10059346 -e NEW_RELIC_LICENSE_KEY=0ce62264499457b6bb48fc18ed2ee650deeb6e2e -e NEW_RELIC_APP_NAME=MPS-DEV -e NEW_RELIC_BROWSER_MONITOR_ENABLE=true -e NEW_RELIC_CAPTURE_PARAMS=true -e NEW_RELIC_LOG_LEVEL=info -e NEW_RELIC_ENABLED=true -e NEW_RELIC_TRACER_ENABLED=true"
fi

docker run -i -d -p=8080:8080 --restart=always $environmentVars --name mps-ui lexmarkweb/mps-ui
