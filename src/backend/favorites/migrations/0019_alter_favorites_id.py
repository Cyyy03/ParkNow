# Generated by Django 4.2.6 on 2023-11-06 05:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('favorites', '0018_alter_favorites_user'),
    ]

    operations = [
        migrations.AlterField(
            model_name='favorites',
            name='id',
            field=models.AutoField(primary_key=True, serialize=False),
        ),
    ]
