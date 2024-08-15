from django.contrib.auth.models import User
from rest_framework import viewsets, permissions

from api.serializers.floor_serializer import FloorSerializer
from core.models import Floor


class FloorViewSet(viewsets.ModelViewSet):
    serializer_class = FloorSerializer

    filterset_fields = [
        'accesses__user',
    ]

    def get_queryset(self):
        user: User = self.request.user
        if user.is_staff:
            return Floor.objects.all()
        else:
            return Floor.objects.filter(accesses__user=user)

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [
                permissions.IsAdminUser(),
            ]
        else:
            return [
                permissions.IsAuthenticated(),
            ]
