from rest_framework import viewsets, permissions

from api.serializers.access_serializer import AccessSerializer
from core.models import Access


class AccessViewSet(viewsets.ModelViewSet):
    queryset = Access.objects.all()
    serializer_class = AccessSerializer
    permission_classes = [
        permissions.IsAuthenticated,
        permissions.IsAdminUser,
    ]
    filterset_fields = [
        'floor',
        'user',
    ]
