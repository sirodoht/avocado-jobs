# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2017-10-09 14:41
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0025_auto_20171009_1357'),
    ]

    operations = [
        migrations.AddField(
            model_name='listing',
            name='confirmed',
            field=models.BooleanField(default=False),
        ),
    ]