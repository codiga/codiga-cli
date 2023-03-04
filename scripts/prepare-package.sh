#!/bin/bash

# install packages
npm install
# package our CLI tool and save the packaged file name 
name=$(npm pack | tail -n 1)
# link the packaged tool
npm link $name