from django.db import models


class SystemConfig(models.Model):
    key = models.CharField(primary_key=True, max_length=8)
    value = models.CharField(max_length=64)
