from django.db import models


class Desk(models.Model):
    floor = models.ForeignKey('Floor', on_delete=models.CASCADE, related_name='desks')

    name = models.CharField(max_length=32)
    description = models.TextField(blank=True, default='')
    tags = models.JSONField(default=list)

    width = models.FloatField()
    height = models.FloatField()
    pos_x = models.FloatField()
    pos_y = models.FloatField()
    orientation = models.FloatField()
