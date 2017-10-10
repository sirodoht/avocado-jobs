from django.apps import AppConfig
import analytics


class MainConfig(AppConfig):
    name = 'main'

    # https://segment.com/docs/sources/server/python/quickstart/
    def ready(self):
        analytics.write_key = 'PQgHtk73z7KmT0ZqK6oiMMH13jXmjGXV'
