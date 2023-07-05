from rest_framework import serializers

from api.serializers.desk_serializer import DeskAnonymousDisplaySerializer, \
    DeskNeutralDisplaySerializer
from api.serializers.room_serializer import RoomAnonymousDisplaySerializer, \
    RoomNeutralDisplaySerializer
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


class FloorAnonymousDisplaySerializer(FloorSerializer):
    desks = DeskAnonymousDisplaySerializer(many=True, read_only=True)
    rooms = RoomAnonymousDisplaySerializer(many=True, read_only=True)


class FloorNeutralDisplaySerializer(FloorSerializer):
    desks = DeskNeutralDisplaySerializer(many=True, read_only=True)
    rooms = RoomNeutralDisplaySerializer(many=True, read_only=True)
