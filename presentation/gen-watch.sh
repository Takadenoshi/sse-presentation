#!/bin/bash

npx nodemon -e md,slidy --exec "sleep 0.1 && pandoc -f markdown -t slidy -o sse.html sse.md --template assets/kadena.slidy --css assets/styles/index.css --css assets/styles/fonts.css --css assets/styles/slides.css"
