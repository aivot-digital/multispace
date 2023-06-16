from django.contrib.auth.models import User
from rest_framework import viewsets, permissions

from api.serializers.user_serializer import UserSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        if self.action in ['create', 'destroy']:
            return [
                permissions.IsAdminUser(),
            ]
        elif self.action in ['update', 'partial_update']:
            return [
                permissions.IsAdminUser(),
            ]
        else:
            return [
                permissions.IsAuthenticated(),
            ]
