# Generated by Django 4.2.2 on 2023-07-03 17:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0008_displaykey_title'),
    ]

    operations = [
        migrations.AddField(
            model_name='displaykey',
            name='anonymous',
            field=models.BooleanField(default=True),
        ),
    ]