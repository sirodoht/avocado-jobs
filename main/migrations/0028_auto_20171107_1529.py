# -*- coding: utf-8 -*-
# Generated by Django 1.11.7 on 2017-11-07 15:29
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0027_auto_20171107_0253'),
    ]

    operations = [
        migrations.AddField(
            model_name='application',
            name='company',
            field=models.CharField(default='default company', max_length=200),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='application',
            name='link',
            field=models.CharField(blank=True, max_length=400, null=True),
        ),
        migrations.AddField(
            model_name='application',
            name='role',
            field=models.CharField(default='default role', max_length=200),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='application',
            name='salary',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]