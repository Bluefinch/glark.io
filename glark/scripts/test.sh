#!/bin/bash

BASE_DIR=`dirname $0`

echo ""
echo "Starting Karma Server"
echo "-------------------------------------------------------------------"

karma start $BASE_DIR/../config/testacular.conf.js $*
