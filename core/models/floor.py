from django.db import models


class Floor(models.Model):
    name = models.CharField(max_length=32)
    image = models.ImageField()

    def delete(self, using=None, keep_parents=False):
        self.image.delete(save=False)
        super().delete(using=using, keep_parents=keep_parents)
