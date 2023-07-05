from django.utils import timezone
from rest_framework import serializers

from core.models import Room, RoomBooking


class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = '__all__'


class RoomAnonymousDisplaySerializer(RoomSerializer):
    is_blocked = serializers.SerializerMethodField('get_is_blocked')

    def get_is_blocked(self, obj: Room):
        now = timezone.now()
        return obj.bookings.filter(
            start__lte=now,
            end__gte=now,
        ).exists()


class RoomNeutralDisplaySerializer(RoomAnonymousDisplaySerializer):
    booking_user = serializers.SerializerMethodField('get_booking_user')

    def get_booking_user(self, obj: Room):
        now = timezone.now()
        bk: RoomBooking = obj.bookings.filter(
            start__lte=now,
            end__gte=now,
        ).first()

        return bk.user.username if bk is not None else None
