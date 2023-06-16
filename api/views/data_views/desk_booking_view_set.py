from django.contrib.auth.models import User
from rest_framework import viewsets, permissions

from api.serializers.desk_booking_serializer import DeskBookingSerializer
from core.models import DeskBooking


class DeskBookingViewSet(viewsets.ModelViewSet):
    serializer_class = DeskBookingSerializer
    filterset_fields = [
        'desk',
        'user',
        'date',
    ]
    queryset = DeskBooking.objects.all()

    def get_queryset(self):
        user: User = self.request.user
        if user.is_staff:
            return
        else:
            return DeskBooking.objects.filter(desk__floor__accesses__user=user)

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [
                permissions.IsAdminUser(),
            ]
        else:
            return [
                permissions.IsAuthenticated(),
            ]
