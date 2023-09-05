#!/bin/bash

npx nodemon -e md,slidy --exec "sleep 0.1 && pandoc -f markdown -t slidy -o sse.html sse.md --template assets/kadena.slidy"
