import uuid
from django.db import models


class DisplayKey(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    floor = models.ForeignKey('Floor', on_delete=models.CASCADE, related_name='display_keys')
