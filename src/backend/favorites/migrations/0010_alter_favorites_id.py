# Generated by Django 4.2.6 on 2023-10-17 16:04

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('favorites', '0009_alter_favorites_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='favorites',
            name='id',
            field=models.UUIDField(default=uuid.UUID('cdcd9d2c-6d06-11ee-a2d9-d213399f323f'), primary_key=True, serialize=False),
        ),
    ]