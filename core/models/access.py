from django.db import models
from django.contrib.auth.models import User
from .floor import Floor


class Access(models.Model):
    user = models.ForeignKey(User, related_name='accesses', on_delete=models.CASCADE)
    floor = models.ForeignKey(Floor, related_name='accesses', on_delete=models.CASCADE)

    class Meta:
        verbose_name = 'Zugriff'
        verbose_name_plural = 'Zugriffe'

    def __str__(self):
        return '{0} accesses {1}'.format(self.user.username, self.floor.name)
