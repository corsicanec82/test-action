#!/bin/bash

MOUNT_POINT=/var/tmp

mkdir -p $MOUNT_POINT/source
docker run -v $MOUNT_POINT:/mnt hexletprojects/css_l1_moon_project:release bash -c 'cp -r /project/. /mnt/source && rm -rf /mnt/source/code'
mkdir -p $MOUNT_POINT/source/code
cp -r `pwd`/. $MOUNT_POINT/source/code
docker tag hexletprojects/css_l1_moon_project:release source_development:latest
cd $MOUNT_POINT/source && docker-compose run development make setup test lint
