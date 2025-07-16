# users/models.py
from django.db import models
from django.contrib.auth.models import User

class TherapistProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    license_id = models.CharField(max_length=100, unique=True)
    organization = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return f"{self.user.username} ({self.license_id})"

