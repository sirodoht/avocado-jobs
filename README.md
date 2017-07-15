# avocado-jobs

Django based job board web application.

## Setup

Create PostgreSQL db for avocado. [See here](https://gist.github.com/sirodoht/0666e232e1baf76f76bac43eb2600e2b).

Update database credentials [here](https://github.com/sirodoht/avocado-jobs/blob/master/avocado/settings.py#L79-L86)
or set `DATABASE_URL` in your shell environment.

Then, migrate your database:
```
python3 manage.py migrate
```

Finally, run the Django server:
```
python3 manage.py runserver
```

## Testing

```
python3 manage.py test
```
