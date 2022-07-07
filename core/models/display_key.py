import uuid
from django.db import models
from .floor import Floor


class DisplayKey(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    floor = models.ForeignKey(Floor, related_name='display_keys', on_delete=models.CASCADE)

    class Meta:
        verbose_name = 'Anzeigeschlüssel'
        verbose_name_plural = 'Anzeigeschlüssel'

    def __str__(self):
        return '{0} @ {1}'.format(self.id, self.floor.name)
