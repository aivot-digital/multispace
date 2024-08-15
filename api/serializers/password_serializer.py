from django.contrib.auth.models import User
from rest_framework import serializers


class PasswordSerializer(serializers.Serializer):
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    password = serializers.CharField(min_length=8, max_length=72)
