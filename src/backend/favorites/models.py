from django.db import models
from django.contrib.auth.models import User

class Favorites(models.Model):
    # Changed id to AutoField for auto incrementing integers
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    carparks = models.JSONField(default=list)