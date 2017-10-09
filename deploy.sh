BRANCH="$(git rev-parse --abbrev-ref HEAD)"

if [ $BRANCH == "master" ]; then
    ssh-keyscan -H avocadojobs.com >> ~/.ssh/known_hosts
    git push dokku@avocadojobs.com:avocadojobs master
fi
