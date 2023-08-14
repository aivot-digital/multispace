from django.db import models
from django.conf import settings


class DeskBooking(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='desk_bookings')
    desk = models.ForeignKey('Desk', on_delete=models.CASCADE, related_name='bookings')
    date = models.DateField()
    created = models.DateField(auto_now_add=True)

    def __str__(self):
        return f'{self.user.username} -> {self.desk.name} ({self.date})'
