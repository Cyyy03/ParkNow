from django.db import models
import uuid

# Create your models here.
class Users(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, null=False)
    username = models.CharField(max_length=20, null=False)
    password = models.CharField(max_length=100, null=False)  # Increased size due to hashed password
    email = models.EmailField(max_length=120, null=False)
    is_active = models.BooleanField(default=False)  # Email verified flag

class emailModel(models.Model):
    Email = models.EmailField(max_length=120, unique=True)
    otp = models.CharField(max_length=6, blank=True, null=True)
    user = models.OneToOneField(Users, on_delete=models.CASCADE, related_name="email_otp")
