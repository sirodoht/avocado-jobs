# avocado-jobs

Job board web application, built with Django.


## Setup

Create PostgreSQL db for avocado. [See here](https://gist.github.com/sirodoht/0666e232e1baf76f76bac43eb2600e2b).

Create virtualenv, enable it and then install requirements:
```
virtualenv -p python3 venv
source venv/bin/activate
pip install -r requirements.txt
```

> Note: This project uses [pip-tools](https://github.com/jazzband/pip-tools) for dependencies management.

Create or update database credentials [here](https://github.com/sirodoht/avocado-jobs/blob/master/avocado/settings.py#L95-L102),
or alternatively set `DATABASE_URL` in your shell environment with the database URI.

Then, migrate your database:
```
python manage.py migrate
```

Finally, run the Django server:
```
python manage.py runserver
```

The Django project is `avocado`. There is one Django app, `main`, which includes
all business logic.


## Frontend

This project uses the [preact](https://github.com/developit/preact) library for the list applications application
and [webpack](https://webpack.js.org/) for bundling.

```sh
webpack --env.NODE_ENV=development -w  # for dev
webpack -p  # for production build
```


## Testing

```
python manage.py test
```


## Quotes

* Hey awesome engineer, these companies below might be interested...
* Did you know it takes the average software engineer two months to find a new job?
* Software is eating the world they say; who's the chef?
* These comments are have been generated using AGI.
* We're gonna build a framework!
* Hi! Did you know that you can always negotiate for a higher salary? Here's is how he did it.
* Maybe buy some Bitcoins instead of applying today?
* Btw, you can donate to Avocado Jobs using your Monero!
* You give REST a bad name, it falls apart and we take the blame
* Your API is a hall of fame; you give REST a bad name.
* Your applications.
* My applications.
* Hi, this is Eva, the local AI here on Avocado. Feel free to ask me anything.
