from django.contrib.auth.models import User
from rest_framework import permissions
from rest_framework.authtoken import views
from rest_framework.response import Response

from api.serializers.password_serializer import PasswordSerializer


class PasswordView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = PasswordSerializer(
            data=request.data,
            context={'request': request},
        )
        serializer.is_valid(raise_exception=True)
        user: User = serializer.validated_data['user']

        if request.user.is_staff or request.user == user:
            user.set_password(serializer.validated_data['password'])
            user.save()

        return Response({'status': 200})
