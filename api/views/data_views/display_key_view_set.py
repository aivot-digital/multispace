from rest_framework import viewsets, permissions

from api.serializers.display_key_serializer import DisplayKeySerializer
from core.models import DisplayKey


class DisplayKeyViewSet(viewsets.ModelViewSet):
    queryset = DisplayKey.objects.all()
    serializer_class = DisplayKeySerializer
    permission_classes = [
        permissions.IsAdminUser,
    ]
    filterset_fields = [
        'floor',
    ]
