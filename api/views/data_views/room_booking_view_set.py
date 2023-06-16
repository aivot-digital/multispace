from django.contrib.auth.models import User
from rest_framework import viewsets, permissions

from api.serializers.room_booking_serializer import RoomBookingSerializer
from core.models import RoomBooking


class RoomBookingViewSet(viewsets.ModelViewSet):
    serializer_class = RoomBookingSerializer
    filterset_fields = [
        'room',
        'user',
        'start',
        'end',
    ]

    def get_queryset(self):
        user: User = self.request.user
        if user.is_staff:
            return RoomBooking.objects.all()
        else:
            return RoomBooking.objects.filter(room__floor__accesses__user=user)

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [
                permissions.IsAdminUser(),
            ]
        else:
            return [
                permissions.IsAuthenticated(),
            ]
