import os

import analytics

from django.apps import AppConfig


class MainConfig(AppConfig):
    name = 'main'

    # https://segment.com/docs/sources/server/python/quickstart/
    def ready(self):
        analytics.write_key = os.getenv('AVOCADO_SECRET_KEY')
