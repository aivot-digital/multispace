from django.utils import timezone
from rest_framework import serializers

from core.models import Room, RoomBooking


class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = '__all__'


class RoomAnonymousDisplaySerializer(RoomSerializer):
    is_blocked = serializers.SerializerMethodField('get_is_blocked')
    is_blocked_from = serializers.SerializerMethodField('get_is_blocked_from')
    is_blocked_until = serializers.SerializerMethodField('get_is_blocked_until')

    def get_is_blocked(self, obj: Room):
        return self._get_booking(obj).exists()

    def get_is_blocked_from(self, obj: Room):
        bk = self._get_booking(obj).first()
        return bk.start if bk is not None else None

    def get_is_blocked_until(self, obj: Room):
        bk = self._get_booking(obj).first()
        return bk.end if bk is not None else None

    def _get_booking(self, obj: Room):
        now = timezone.now()
        return obj.bookings.filter(
            start__lte=now,
            end__gte=now,
        )


class RoomNeutralDisplaySerializer(RoomAnonymousDisplaySerializer):
    booking_user = serializers.SerializerMethodField('get_booking_user')

    def get_booking_user(self, obj: Room):
        now = timezone.now()
        bk: RoomBooking = obj.bookings.filter(
            start__lte=now,
            end__gte=now,
        ).first()

        return bk.user.username if bk is not None else None
