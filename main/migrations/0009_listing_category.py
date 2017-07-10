# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2017-07-10 21:42
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0008_remove_listing_role_subtitle'),
    ]

    operations = [
        migrations.AddField(
            model_name='listing',
            name='category',
            field=models.CharField(choices=[('FE', 'Frontend'), ('BE', 'Backend'), ('FS', 'Fullstack'), ('DO', 'Devops'), ('MB', 'Mobile')], max_length=2, null=True),
        ),
    ]
