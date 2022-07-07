from django.db import models
from django.contrib.auth.models import User

from .desk import Desk


class Booking(models.Model):
    user = models.ForeignKey(User, related_name='bookings', on_delete=models.CASCADE)
    desk = models.ForeignKey(Desk, related_name='bookings', on_delete=models.CASCADE)
    date = models.DateField()

    class Meta:
        verbose_name = 'Buchung'
        verbose_name_plural = 'Buchungen'

    def __str__(self):
        return '{0} booked desk {1} on {2}'.format(
            self.user.username,
            self.desk.name,
            self.date,
        )
