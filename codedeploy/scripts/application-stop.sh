#!/bin/bash

# Short circuit logic; if container isn't running, don't block progress.
docker stop mps-ui
exit 0
