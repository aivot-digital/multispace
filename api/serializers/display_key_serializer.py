from rest_framework import serializers

from core.models import DisplayKey


class DisplayKeySerializer(serializers.ModelSerializer):
    class Meta:
        model = DisplayKey
        fields = '__all__'
