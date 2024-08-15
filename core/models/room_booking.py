from django.db import models
from django.conf import settings


class RoomBooking(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='room_bookings')
    room = models.ForeignKey('Room', on_delete=models.CASCADE, related_name='bookings')
    start = models.DateTimeField()
    end = models.DateTimeField()
    created = models.DateField(auto_now_add=True)

    def __str__(self):
        return f'{self.user.username} -> {self.room.name} ({self.start} - {self.end})'