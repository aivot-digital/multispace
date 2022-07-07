from django.db import models

from .floor import Floor


class Room(models.Model):
    floor = models.ForeignKey(Floor, related_name='rooms', on_delete=models.CASCADE)
    name = models.CharField(max_length=32)

    class Meta:
        verbose_name = 'Raum'
        verbose_name_plural = 'Räume'

    def __str__(self):
        return self.name
