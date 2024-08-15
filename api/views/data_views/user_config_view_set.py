from rest_framework import viewsets

from api.serializers.user_config_serializer import UserConfigSerializer
from core.models import UserConfig


class UserConfigViewSet(viewsets.ModelViewSet):
    serializer_class = UserConfigSerializer

    def get_queryset(self):
        return UserConfig.objects.filter(user=self.request.user)
