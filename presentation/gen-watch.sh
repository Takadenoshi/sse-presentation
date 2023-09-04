#!/bin/bash

npx nodemon -e md,slidy --exec "pandoc -f markdown -t slidy -s -o sse.html sse.md --template assets/my.slidy"
