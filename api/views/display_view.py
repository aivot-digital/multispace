from rest_framework import views
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response

from api.serializers.display_key_serializer import DisplayKeySerializer
from api.serializers.floor_serializer import FloorNeutralDisplaySerializer, FloorAnonymousDisplaySerializer
from core.models import DisplayKey


class DisplayView(views.APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request, display_key: str):
        display = get_object_or_404(DisplayKey, id=display_key)

        if display.anonymous:
            floor_data = FloorAnonymousDisplaySerializer(display.floor).data
        else:
            floor_data = FloorNeutralDisplaySerializer(display.floor).data

        return Response({
            'display': DisplayKeySerializer(display).data,
            'floor': floor_data,
        })
