#!/usr/bin/env bash

# sleep 0.1s fixes some bugs with partially rendered content
# when the slidy template was too large (we had inlined images)
npx nodemon -e md,slidy --exec "sleep 0.1 && ./gen.sh"
