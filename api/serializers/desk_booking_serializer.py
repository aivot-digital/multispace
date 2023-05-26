from rest_framework import serializers

from core.models import DeskBooking


class DeskBookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeskBooking
        fields = '__all__'
