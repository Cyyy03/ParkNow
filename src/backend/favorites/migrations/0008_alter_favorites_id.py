# Generated by Django 4.2.6 on 2023-10-17 15:17

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('favorites', '0007_alter_favorites_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='favorites',
            name='id',
            field=models.UUIDField(default=uuid.UUID('4b382126-6d00-11ee-83cf-d213399f323f'), primary_key=True, serialize=False),
        ),
    ]