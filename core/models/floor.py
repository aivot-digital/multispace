from django.db import models


class Floor(models.Model):
    name = models.CharField(max_length=32)
    image = models.ImageField()

    class Meta:
        verbose_name = 'Bereich'
        verbose_name_plural = 'Bereiche'

    def __str__(self):
        return self.name
