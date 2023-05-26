from django.contrib.auth.models import User
from rest_framework import viewsets, permissions

from api.serializers.room_serializer import RoomSerializer
from core.models import Room


class RoomViewSet(viewsets.ModelViewSet):
    serializer_class = RoomSerializer
    filterset_fields = [
        'floor',
    ]

    def get_queryset(self):
        user: User = self.request.user
        if user.is_staff:
            return Room.objects.all()
        else:
            return Room.objects.filter(floor__accesses__user=user)

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return permissions.IsAdminUser()
        else:
            return permissions.IsAuthenticated()
