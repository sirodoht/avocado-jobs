# Generated by Django 2.0 on 2018-01-09 23:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0007_reminder'),
    ]

    operations = [
        migrations.AddField(
            model_name='reminder',
            name='completed',
            field=models.BooleanField(default=False),
        ),
    ]
