#!/bin/sh

DIR=$(dirname $0)

source $DIR/creds.sh

APP_ROOT=$(dirname $DIR)

node $APP_ROOT/index.js
