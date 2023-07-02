from django.utils import timezone
from rest_framework import serializers

from core.models import Desk


class DeskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Desk
        fields = '__all__'


class DeskDisplaySerializer(DeskSerializer):
    is_blocked = serializers.SerializerMethodField('get_is_blocked')

    def get_is_blocked(self, obj: Desk):
        now = timezone.now()
        return obj.bookings.filter(
            date__year=now.year,
            date__month=now.month,
            date__day=now.day,
        ).exists()
