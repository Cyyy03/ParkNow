# Generated by Django 4.2.6 on 2023-11-06 05:15

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('login', '0009_users_is_active_alter_users_id_alter_users_password_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='users',
            name='id',
            field=models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False),
        ),
    ]
