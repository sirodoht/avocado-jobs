# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2017-07-14 17:37
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0009_auto_20170714_1731'),
    ]

    operations = [
        migrations.AddField(
            model_name='listing',
            name='apply_email',
            field=models.EmailField(blank=True, max_length=254),
        ),
    ]
