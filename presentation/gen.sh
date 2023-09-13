#!/usr/bin/env bash

pandoc -f markdown -t slidy -o index.html source.md --template assets/kadena.slidy --css assets/styles/index.css --css assets/styles/fonts.css --css assets/styles/slides.css $@
