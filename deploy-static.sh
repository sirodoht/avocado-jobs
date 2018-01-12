#!/usr/bin/env bash

npm start

python manage.py collectstatic

./set-secrets.sh

aws s3 sync avocado/staticfiles/ s3://avocado-jobs/static --exclude "*.DS_Store*" --acl public-read --cache-control max-age=31536000
