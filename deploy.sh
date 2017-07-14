#!/bin/bash

if [ "$(git rev-parse --symbolic-full-name --abbrev-ref HEAD)" != "master" ]; then
    echo "This is not the master branch."
    exit 0
fi

git push origin master &&
git checkout dokku &&
git rebase master &&
git push origin dokku -f &&
git push dokku dokku:master -f &&
git checkout master
