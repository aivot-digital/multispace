from rest_framework import viewsets, permissions

from api.serializers.system_config_serializer import SystemConfigSerializer
from core.models import SystemConfig


class SystemConfigViewSet(viewsets.ModelViewSet):
    queryset = SystemConfig.objects.all()
    serializer_class = SystemConfigSerializer
    lookup_field = 'key'

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAdminUser()]
        else:
            return []
