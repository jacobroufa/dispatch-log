#!/bin/sh

DIR=$(dirname $0)

. $DIR/creds.sh

APP_ROOT=$(dirname $DIR)

node $APP_ROOT/index.js
