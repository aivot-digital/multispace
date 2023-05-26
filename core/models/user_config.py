from django.contrib.auth.models import User
from django.db import models


class UserConfig(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='configs')
    key = models.CharField(max_length=8)
    value = models.CharField(max_length=64)

    class Meta:
        unique_together = (
            'user',
            'key',
        )
