docker pull lexmarkweb/mps-ui
printenv
if [ "$DEPLOYMENT_GROUP_NAME" == "mps-ui-dev" ]
then
environmentVars="-e 'NEWRELICID=10059346'"
else
environmentVars=""
fi

docker run -i -d -p=8080:8080 --restart=always $environmentVars --name mps-ui lexmarkweb/mps-ui
