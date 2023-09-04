#!/bin/bash

npx nodemon -w sse.md --exec "pandoc -o sse.pdf sse.md && pandoc -o sse-landscape.pdf sse.md -V geometry:landscape"
