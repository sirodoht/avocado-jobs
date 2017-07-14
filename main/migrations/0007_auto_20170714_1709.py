# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2017-07-14 17:09
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0006_auto_20170714_1617'),
    ]

    operations = [
        migrations.AddField(
            model_name='listing',
            name='role_type',
            field=models.CharField(blank=True, choices=[('R', 'Remote'), ('O', 'Onsite')], max_length=1),
        ),
        migrations.AlterField(
            model_name='listing',
            name='poster_email',
            field=models.EmailField(blank=True, max_length=254),
        ),
    ]
