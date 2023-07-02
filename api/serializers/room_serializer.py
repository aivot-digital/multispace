from django.utils import timezone
from rest_framework import serializers

from core.models import Room


class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = '__all__'


class RoomDisplaySerializer(RoomSerializer):
    is_blocked = serializers.SerializerMethodField('get_is_blocked')

    def get_is_blocked(self, obj: Room):
        now = timezone.now()
        return obj.bookings.filter(
            start__lte=now,
            end__gte=now,
        ).exists()
