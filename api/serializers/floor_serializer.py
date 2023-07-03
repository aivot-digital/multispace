from rest_framework import serializers

from api.serializers.desk_serializer import DeskDisplaySerializer
from api.serializers.room_serializer import RoomDisplaySerializer
from core.models import Floor


class FloorSerializer(serializers.ModelSerializer):
    desk_count = serializers.SerializerMethodField('get_desk_count')
    access_count = serializers.SerializerMethodField('get_access_count')
    room_count = serializers.SerializerMethodField('get_room_count')

    class Meta:
        model = Floor
        fields = '__all__'

    def get_desk_count(self, obj: Floor):
        return obj.desks.count()

    def get_access_count(self, obj: Floor):
        return obj.accesses.count()

    def get_room_count(self, obj: Floor):
        return obj.rooms.count()


class FloorDisplaySerializer(FloorSerializer):
    desks = DeskDisplaySerializer(many=True, read_only=True)
    rooms = RoomDisplaySerializer(many=True, read_only=True)
