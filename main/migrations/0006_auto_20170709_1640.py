# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2017-07-09 16:40
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0005_auto_20170709_1638'),
    ]

    operations = [
        migrations.AlterField(
            model_name='listing',
            name='company_image',
            field=models.CharField(blank=True, max_length=300),
        ),
    ]
