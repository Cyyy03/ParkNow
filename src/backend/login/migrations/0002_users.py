# Generated by Django 4.2.6 on 2023-10-11 08:28

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('login', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Users',
            fields=[
                ('id', models.UUIDField(default=uuid.UUID('223ca8ea-6810-11ee-af4e-d213399f323f'), editable=False, primary_key=True, serialize=False)),
                ('username', models.CharField(max_length=20)),
                ('password', models.CharField(max_length=20)),
                ('email', models.EmailField(max_length=120)),
            ],
        ),
    ]
