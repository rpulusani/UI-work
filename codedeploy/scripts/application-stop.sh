#!/bin/bash
containerName="mps-ui"

isRunning=`docker ps --filter "name=$containerName" | tail -n 1 | awk '{print $1}'`
container="CONTAINER"
if [[ $isRunning != $container ]]; then
  docker stop $containerName
  docker rm $containerName
fi
