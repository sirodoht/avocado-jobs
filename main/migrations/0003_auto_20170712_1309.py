# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2017-07-12 13:09
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0002_auto_20170712_1219'),
    ]

    operations = [
        migrations.AlterField(
            model_name='category',
            name='category_name',
            field=models.CharField(max_length=50, null=True),
        ),
    ]