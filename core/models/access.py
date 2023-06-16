from django.conf import settings
from django.db import models


class Access(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='accesses')
    floor = models.ForeignKey('Floor', on_delete=models.CASCADE, related_name='accesses')
    is_maintainer = models.BooleanField(default=False)

    def __str__(self):
        return f'{self.user.username} -> {self.floor.name}'
