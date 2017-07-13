#!/bin/bash

git checkout dokku &&
git rebase master &&
git push origin dokku -f &&
git push dokku dokku:master -f &&
git checkout master
