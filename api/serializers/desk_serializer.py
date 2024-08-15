from django.utils import timezone
from rest_framework import serializers

from core.models import Desk, DeskBooking


class DeskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Desk
        fields = '__all__'


class DeskAnonymousDisplaySerializer(DeskSerializer):
    is_blocked = serializers.SerializerMethodField('get_is_blocked')

    def get_is_blocked(self, obj: Desk):
        now = timezone.now()
        return obj.bookings.filter(
            date__year=now.year,
            date__month=now.month,
            date__day=now.day,
        ).exists()


class DeskNeutralDisplaySerializer(DeskAnonymousDisplaySerializer):
    booking_user = serializers.SerializerMethodField('get_booking_user')

    def get_booking_user(self, obj: Desk):
        now = timezone.now()
        bk: DeskBooking = obj.bookings.filter(
            date__year=now.year,
            date__month=now.month,
            date__day=now.day,
        ).first()

        return bk.user.username if bk is not None else None
