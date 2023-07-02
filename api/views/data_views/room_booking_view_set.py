from datetime import datetime
from django.contrib.auth.models import User
from django.utils.dateparse import parse_datetime
from rest_framework import viewsets, permissions

from api.serializers.room_booking_serializer import RoomBookingSerializer
from core.models import RoomBooking


class RoomBookingViewSet(viewsets.ModelViewSet):
    serializer_class = RoomBookingSerializer
    filterset_fields = [
        'room',
        'room__floor',
        'user',
    ]

    def get_queryset(self):
        user: User = self.request.user

        query_params = self.request.query_params

        query = RoomBooking.objects.all()

        if 'start__gte' in query_params:
            query = query.filter(
                start__gte=parse_datetime(query_params['start__gte'])
            )

        if 'start__lte' in query_params:
            query = query.filter(
                start__lte=parse_datetime(query_params['start__lte']),
            )

        if not user.is_staff:
            query = query.filter(room__floor__accesses__user=user)

        return query.order_by('start')

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [
                permissions.IsAdminUser(),
            ]
        else:
            return [
                permissions.IsAuthenticated(),
            ]
