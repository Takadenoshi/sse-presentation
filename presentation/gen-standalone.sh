#!/bin/bash

pandoc -f markdown -t slidy --self-contained -o sse.html sse.md --template assets/kadena.slidy
