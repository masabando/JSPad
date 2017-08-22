#! /bin/bash

sass -C --scss --style compressed css/base.css:compressed/css/base.css
./node_modules/babel-cli/bin/babel.js --compact --no-comments js -d compressed/js
