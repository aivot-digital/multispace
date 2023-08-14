from rest_framework import serializers

from core.models import DeskBooking


class DeskBookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeskBooking
        fields = '__all__'

    def validate(self, data):
        data = super().validate(data)

        exists = DeskBooking.objects.filter(
            desk_id=data['desk'],
            date__year=data['date'].year,
            date__month=data['date'].month,
            date__day=data['date'].day,
        ).exists()
        if exists:
            raise serializers.ValidationError('This desk is already booked')

        return data
