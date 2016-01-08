#!/bin/bash

node_modules/.bin/mocha --colors --recursive \
  --compilers js:mocha-babel \
  --watch
