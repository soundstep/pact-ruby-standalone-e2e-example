#!/usr/bin/env bash

rm -rf log/*.log

# start mock service
pact/bin/pact-mock-service start -p 1234 --pact-dir ./pacts --log ./log/foo-bar-mock-service.log

# clear interactions (not necessary for this example, just showing how)
curl -X DELETE -H "X-Pact-Mock-Service: true"  localhost:1234/interactions
