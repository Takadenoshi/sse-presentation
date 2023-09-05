#!/bin/bash

pandoc -f markdown -t slidy -s --self-contained --embed-resources -o sse.html sse.md --template assets/kadena.slidy
