import uuid
from django.db import models


class DisplayKey(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=191)
    floor = models.ForeignKey('Floor', on_delete=models.CASCADE, related_name='display_keys')
    anonymous = models.BooleanField(default=True)
    list_view = models.BooleanField(default=False)

    def __str__(self):
        return f'{self.title} ({self.floor.name})'
