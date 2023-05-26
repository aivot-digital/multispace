from django.db import models


class Room(models.Model):
    floor = models.ForeignKey('Floor', on_delete=models.CASCADE, related_name='rooms')
    name = models.CharField(max_length=32)
    description = models.TextField(blank=True, default='')
    tags = models.JSONField(default=list)
