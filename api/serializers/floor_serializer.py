from rest_framework import serializers

from api.serializers.desk_serializer import DeskSerializer
from api.serializers.room_serializer import RoomSerializer
from core.models import Floor


class FloorSerializer(serializers.ModelSerializer):
    desk_count = serializers.SerializerMethodField('get_desk_count')
    access_count = serializers.SerializerMethodField('get_access_count')

    class Meta:
        model = Floor
        fields = '__all__'

    def get_desk_count(self, obj: Floor):
        return obj.desks.count()

    def get_access_count(self, obj: Floor):
        return obj.accesses.count()


class NestedFloorSerializer(FloorSerializer):
    desks = DeskSerializer(many=True)
    rooms = RoomSerializer(many=True)
