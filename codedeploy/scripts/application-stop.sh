#!/bin/bash

containerName="mps-ui"

isRunning=`docker ps --filter "name=$containerName" | tail -n 1 | awk '{print $1}'`
if [[ $isRunning -ne "CONTAINER" ]]; then
  docker stop $containerName
  docker rm $containerName
fi

