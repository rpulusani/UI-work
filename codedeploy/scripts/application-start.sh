
if [ "$DEPLOYMENT_GROUP_NAME" == "mps-ui-dev" ]
then
docker pull lexmarkweb/mps-ui
environmentVars="-e ENVIRONMENT=UNKNOWN -e NEWRELICID=10059346 -e NEW_RELIC_LICENSE_KEY=0ce62264499457b6bb48fc18ed2ee650deeb6e2e -e NEW_RELIC_APP_NAME=MPS-DEV -e NEW_RELIC_BROWSER_MONITOR_ENABLE=true -e NEW_RELIC_CAPTURE_PARAMS=true -e NEW_RELIC_LOG_LEVEL=info -e NEW_RELIC_ENABLED=true -e NEW_RELIC_TRACER_ENABLED=true -e IDP_SERVICE_URL=https://idp-staging.psft.co -e IDP_CLIENT_ID=mps-portal -e PORTAL_API_URL=http://10.145.116.233:8080/8080"
elif ["$DEPLOYMENT_GROUP_NAME" == "mps-ui-stable" ]
then
    docker pull lexmarkweb/mps-ui:stable
    environmentVars="-e ENVIRONMENT=UNKNOWN -e NEWRELICID=10059346 -e NEW_RELIC_LICENSE_KEY=0ce62264499457b6bb48fc18ed2ee650deeb6e2e -e NEW_RELIC_APP_NAME=MPS-DEV -e NEW_RELIC_BROWSER_MONITOR_ENABLE=true -e NEW_RELIC_CAPTURE_PARAMS=true -e NEW_RELIC_LOG_LEVEL=info -e NEW_RELIC_ENABLED=true -e NEW_RELIC_TRACER_ENABLED=true -e IDP_SERVICE_URL=https://idp-staging.psft.co -e IDP_CLIENT_ID=mps-portal -e PORTAL_API_URL=http://mps-api-stable-lb-795924387.us-east-1.elb.amazonaws.com/mps"
    docker run -i -d -p=8080:8080 --restart=always $environmentVars --name mps-ui lexmarkweb/mps-ui:stable

else
docker pull lexmarkweb/mps-ui
environmentVars="-e ENVIRONMENT=UNKNOWN -e NEWRELICID=10059346 -e NEW_RELIC_LICENSE_KEY=0ce62264499457b6bb48fc18ed2ee650deeb6e2e -e NEW_RELIC_APP_NAME=MPS-DEV -e NEW_RELIC_BROWSER_MONITOR_ENABLE=true -e NEW_RELIC_CAPTURE_PARAMS=true -e NEW_RELIC_LOG_LEVEL=info -e NEW_RELIC_ENABLED=true -e NEW_RELIC_TRACER_ENABLED=true -e IDP_SERVICE_URL=https://idp-staging.psft.co -e IDP_CLIENT_ID=mps-portal -e PORTAL_API_URL=http://10.145.116.233:8080/8080"
docker run -i -d -p=8080:8080 --restart=always $environmentVars --name mps-ui lexmarkweb/mps-ui
fi


