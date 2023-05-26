from rest_framework import views
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response

from api.serializers.floor_serializer import NestedFloorSerializer
from core.models import DisplayKey


class DisplayView(views.APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request, display_key: str):
        display = get_object_or_404(DisplayKey, id=display_key)
        return Response(NestedFloorSerializer(display.floor).data)
