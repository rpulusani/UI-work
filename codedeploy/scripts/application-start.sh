
if [ "$DEPLOYMENT_GROUP_NAME" == "mps-ui-dev" ]; then

docker pull lexmarkweb/mps-ui
environmentVars="-e ENVIRONMENT=UNKNOWN -e NEWRELICID=10059346 -e NEW_RELIC_LICENSE_KEY=0ce62264499457b6bb48fc18ed2ee650deeb6e2e -e NEW_RELIC_APP_NAME=MPS-DEV -e NEW_RELIC_BROWSER_MONITOR_ENABLE=true -e NEW_RELIC_CAPTURE_PARAMS=true -e NEW_RELIC_LOG_LEVEL=info -e NEW_RELIC_ENABLED=true -e NEW_RELIC_TRACER_ENABLED=true -e IDP_SERVICE_URL=https://idp-staging.psft.co -e IDP_CLIENT_ID=mps-portal -e PORTAL_API_URL=https://api.venus-dev.lexmark.com/mps/ -e REDIRECT_URL=/auth/users/sign_out?redirect_uri=https://venus-dev.lexmark.com -e IMAGE_NOW_SECRET=UeV5DfuEzXsLsTzRP1a3ragNAQRt73GrOK2XZkjm6zIXyNZD66LZt4LvUuVh3O8RUnoZhDPADxu6lXW030i9NSv_dfciMO3JDA-Dm5ePlvVUKW7RMXuVrJG8wjfOiiQQA7VoTXYiYPdTfawRvzaiqrwLD06dKXA4Mww2KLJppGA -e IMAGE_NOW_URL=https://in-qa.lexmark.com/SecureFileDelivery/SAP/"
docker run -i -d -p=8080:8080 --restart=always $environmentVars --name mps-ui lexmarkweb/mps-ui
elif [ "$DEPLOYMENT_GROUP_NAME" == "mps-ui-stable" ]; then

docker pull lexmarkweb/mps-ui:stable
environmentVars="-e ENVIRONMENT=UNKNOWN -e NEWRELICID=10059346 -e NEW_RELIC_LICENSE_KEY=0ce62264499457b6bb48fc18ed2ee650deeb6e2e -e NEW_RELIC_APP_NAME=MPS-DEV -e NEW_RELIC_BROWSER_MONITOR_ENABLE=true -e NEW_RELIC_CAPTURE_PARAMS=true -e NEW_RELIC_LOG_LEVEL=info -e NEW_RELIC_ENABLED=true -e NEW_RELIC_TRACER_ENABLED=true -e IDP_SERVICE_URL=https://idp-staging.psft.co -e IDP_CLIENT_ID=mps-portal -e PORTAL_API_URL=https://api.venus-beta.lexmark.com/mps/ -e REDIRECT_URL=/auth/users/sign_out?redirect_uri=https://venus-beta.lexmark.com/ -e IMAGE_NOW_SECRET=UeV5DfuEzXsLsTzRP1a3ragNAQRt73GrOK2XZkjm6zIXyNZD66LZt4LvUuVh3O8RUnoZhDPADxu6lXW030i9NSv_dfciMO3JDA-Dm5ePlvVUKW7RMXuVrJG8wjfOiiQQA7VoTXYiYPdTfawRvzaiqrwLD06dKXA4Mww2KLJppGA -e IMAGE_NOW_URL=https://in-qa.lexmark.com/SecureFileDelivery/SAP/"
docker run -i -d -p=8080:8080 --restart=always $environmentVars --name mps-ui lexmarkweb/mps-ui:stable
fi
