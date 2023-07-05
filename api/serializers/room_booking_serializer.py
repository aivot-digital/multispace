from django.db.models import Q
from rest_framework import serializers

from core.models import RoomBooking


class RoomBookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoomBooking
        fields = '__all__'

    def validate(self, data):
        data = super().validate(data)

        exists = RoomBooking.objects.filter(
            room_id=data['room']
        ).filter(
            Q(
                start__lte=data['start'],
                end__gte=data['start'],
            ) | Q(
                start__gte=data['end'],
                end__lte=data['end'],
            )
        ).exists()
        if exists:
            raise serializers.ValidationError('This room is already booked')

        return data