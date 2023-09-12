#!/bin/sh

if [ "$DOCKER_ENV" = "true" ];
then
  echo "Enabling environment variables for Docker"
  echo "DOCKER_ENV=$DOCKER_ENV"
  echo
else
  mkdir -p ./dist/src
  cp ./src/env.yml ./dist/src
fi
echo "> removing dist"
rm -rf ./dist
echo
echo "> transpiling...d"
npm run build

echo
echo "> Successfully build  teste "

echo
echo "> Starting application.. teste."
echo

node ./dist/src/main.js
