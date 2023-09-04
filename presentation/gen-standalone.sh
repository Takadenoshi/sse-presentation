#!/bin/bash

pandoc -f markdown -t slidy -s --self-contained -o sse.html sse.md --template assets/my.slidy
