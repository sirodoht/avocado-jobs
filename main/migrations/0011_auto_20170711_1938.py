# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2017-07-11 19:38
from __future__ import unicode_literals

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0010_auto_20170710_2145'),
    ]

    operations = [
        migrations.AlterField(
            model_name='listing',
            name='pub_date',
            field=models.DateTimeField(default=datetime.datetime.now, verbose_name='date published'),
        ),
    ]
