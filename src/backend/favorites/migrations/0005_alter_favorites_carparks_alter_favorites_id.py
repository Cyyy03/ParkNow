# Generated by Django 4.2.6 on 2023-10-15 12:04

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('favorites', '0004_alter_favorites_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='favorites',
            name='carparks',
            field=models.JSONField(default=list),
        ),
        migrations.AlterField(
            model_name='favorites',
            name='id',
            field=models.UUIDField(default=uuid.UUID('0c99f628-6b53-11ee-ab1b-d213399f323f'), primary_key=True, serialize=False),
        ),
    ]