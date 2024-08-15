from django.contrib.auth.models import User
from django.utils.dateparse import parse_datetime
from rest_framework import viewsets, permissions

from api.serializers.desk_booking_serializer import DeskBookingSerializer
from core.models import DeskBooking


class DeskBookingViewSet(viewsets.ModelViewSet):
    serializer_class = DeskBookingSerializer
    filterset_fields = [
        'desk',
        'desk__floor',
        'user',
    ]
    permission_classes = [
        permissions.IsAuthenticated,
    ]

    def get_queryset(self):
        user: User = self.request.user

        query_params = self.request.query_params

        query = DeskBooking.objects.all()

        if 'date__gte' in query_params:
            query = query.filter(
                date__gte=parse_datetime(
                    query_params['date__gte']
                ).replace(
                    hour=0,
                    minute=0,
                    second=0,
                    microsecond=0,
                ),
            )

        if 'date__lte' in query_params:
            query = query.filter(
                date__lte=parse_datetime(
                    query_params['date__lte']
                ).replace(
                    hour=23,
                    minute=59,
                    second=59,
                    microsecond=999999,
                ),
            )

        if not user.is_staff:
            query = query.filter(desk__floor__accesses__user=user)

        return query.order_by('date')
