# Generated by Django 4.1.3 on 2023-04-26 13:50

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('core', '0003_systemconfig_userconfig_delete_preferences'),
    ]

    operations = [
        migrations.CreateModel(
            name='DeskBooking',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField()),
                ('created', models.DateField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='RoomBooking',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('start', models.DateTimeField()),
                ('end', models.DateTimeField()),
                ('created', models.DateField(auto_now_add=True)),
            ],
        ),
        migrations.AlterModelOptions(
            name='access',
            options={},
        ),
        migrations.AlterModelOptions(
            name='desk',
            options={},
        ),
        migrations.AlterModelOptions(
            name='displaykey',
            options={},
        ),
        migrations.AlterModelOptions(
            name='floor',
            options={},
        ),
        migrations.AlterModelOptions(
            name='room',
            options={},
        ),
        migrations.RemoveField(
            model_name='desk',
            name='is_blocked',
        ),
        migrations.RemoveField(
            model_name='desk',
            name='room',
        ),
        migrations.AddField(
            model_name='desk',
            name='description',
            field=models.TextField(blank=True, default=''),
        ),
        migrations.AddField(
            model_name='desk',
            name='floor',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='desks', to='core.floor'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='desk',
            name='tags',
            field=models.JSONField(default=list),
        ),
        migrations.AddField(
            model_name='room',
            name='description',
            field=models.TextField(blank=True, default=''),
        ),
        migrations.AddField(
            model_name='room',
            name='tags',
            field=models.JSONField(default=list),
        ),
        migrations.DeleteModel(
            name='Booking',
        ),
        migrations.AddField(
            model_name='roombooking',
            name='room',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='bookings', to='core.room'),
        ),
        migrations.AddField(
            model_name='roombooking',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='room_bookings', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='deskbooking',
            name='desk',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='bookings', to='core.desk'),
        ),
        migrations.AddField(
            model_name='deskbooking',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='desk_bookings', to=settings.AUTH_USER_MODEL),
        ),
    ]
