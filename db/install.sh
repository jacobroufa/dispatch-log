#!/bin/sh

DIR=$(dirname $0)

. $DIR/creds.sh

mysql -u $DISPATCH_DB_USER -p$DISPATCH_DB_PASS $DISPATCH_DB < $DIR/dispatch-events-schema.sql
