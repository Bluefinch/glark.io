#!/bin/bash

BASE_DIR=`dirname $0`

echo ""
echo "Starting karma Server"
echo "-------------------------------------------------------------------"

karma start $BASE_DIR/../config/testacular-e2e.conf.js $*
