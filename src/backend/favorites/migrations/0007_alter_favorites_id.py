# Generated by Django 4.2.6 on 2023-10-17 15:07

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('favorites', '0006_alter_favorites_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='favorites',
            name='id',
            field=models.UUIDField(default=uuid.UUID('dfa76c7e-6cfe-11ee-a6ab-d213399f323f'), primary_key=True, serialize=False),
        ),
    ]
