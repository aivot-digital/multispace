# Generated by Django 4.0.3 on 2022-06-25 07:12

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='access',
            options={'verbose_name': 'Zugriff', 'verbose_name_plural': 'Zugriffe'},
        ),
        migrations.AlterModelOptions(
            name='booking',
            options={'verbose_name': 'Buchung', 'verbose_name_plural': 'Buchungen'},
        ),
        migrations.AlterModelOptions(
            name='desk',
            options={'verbose_name': 'Arbeitsplatz', 'verbose_name_plural': 'Arbeitsplätze'},
        ),
        migrations.AlterModelOptions(
            name='displaykey',
            options={'verbose_name': 'Anzeigeschlüssel', 'verbose_name_plural': 'Anzeigeschlüssel'},
        ),
        migrations.AlterModelOptions(
            name='floor',
            options={'verbose_name': 'Bereich', 'verbose_name_plural': 'Bereiche'},
        ),
        migrations.AlterModelOptions(
            name='preferences',
            options={'verbose_name': 'Einstellungen', 'verbose_name_plural': 'Einstellungen'},
        ),
        migrations.AlterModelOptions(
            name='room',
            options={'verbose_name': 'Raum', 'verbose_name_plural': 'Räume'},
        ),
    ]
