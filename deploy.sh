BRANCH="$(git rev-parse --abbrev-ref HEAD)"

if [ $BRANCH == "master" ]; then
    echo "Deployment starting..."
    ssh-keyscan -H avocadojobs.com >> ~/.ssh/known_hosts
    git push dokku@avocadojobs.com:avocadojobs master
else
    echo "Not on master, deployment canceled."
fi
