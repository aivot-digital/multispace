from rest_framework import serializers

from core.models import UserConfig


class UserConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserConfig
        fields = '__all__'
