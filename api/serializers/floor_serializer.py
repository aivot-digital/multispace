from rest_framework import serializers

from api.serializers.desk_serializer import DeskSerializer
from api.serializers.room_serializer import RoomSerializer
from core.models import Floor


class FloorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Floor
        fields = '__all__'


class NestedFloorSerializer(FloorSerializer):
    desks = DeskSerializer(many=True)
    rooms = RoomSerializer(many=True)
