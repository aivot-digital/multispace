from django.db import models

from .room import Room


class Desk(models.Model):
    room = models.ForeignKey(Room, related_name='desks', on_delete=models.CASCADE)
    name = models.CharField(max_length=32)
    width = models.FloatField()
    height = models.FloatField()
    pos_x = models.FloatField()
    pos_y = models.FloatField()
    orientation = models.FloatField()
    is_blocked = models.BooleanField(default=False)

    class Meta:
        verbose_name = 'Arbeitsplatz'
        verbose_name_plural = 'Arbeitsplätze'

    def __str__(self):
        return self.name
