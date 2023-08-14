from django.contrib.auth.models import User
from rest_framework import viewsets, permissions

from api.serializers.desk_serializer import DeskSerializer
from core.models import Desk


class DeskViewSet(viewsets.ModelViewSet):
    serializer_class = DeskSerializer
    filterset_fields = [
        'floor',
    ]

    def get_queryset(self):
        user: User = self.request.user
        if user.is_staff:
            return Desk.objects.all()
        else:
            return Desk.objects.filter(floor__accesses__user=user)

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [
                permissions.IsAdminUser(),
            ]
        else:
            return [
                permissions.IsAuthenticated(),
            ]
