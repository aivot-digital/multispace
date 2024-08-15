from django.contrib.auth.models import User
from rest_framework import viewsets, permissions

from api.serializers.user_serializer import UserSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    filterset_fields = [
        'id',
    ]

    def get_permissions(self):
        if self.action in ['create', 'destroy']:
            return [
                permissions.IsAuthenticated(),
                permissions.IsAdminUser(),
            ]
        elif self.action in ['update', 'partial_update']:
            return [
                permissions.IsAuthenticated(),
                permissions.IsAdminUser(),
            ]
        else:
            return [
                permissions.IsAuthenticated(),
            ]
