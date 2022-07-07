from django.core.files.images import ImageFile
from django.http import HttpResponse
from django.views.generic import TemplateView
from core.models import Floor, Room, Desk
from django.shortcuts import get_object_or_404
from django.contrib.auth.mixins import LoginRequiredMixin, PermissionRequiredMixin
from django.core import serializers
import io
import zipfile
from os.path import basename


class ManageFloorsView(LoginRequiredMixin, PermissionRequiredMixin, TemplateView):
    template_name = 'web/manage_floors.html'
    permission_required = 'is_staff'

    def post(self, request, *args, **kwargs):
        file = request.FILES.get('file')
        if file is not None:
            zipfile_obj = zipfile.ZipFile(file, 'r')

            floors_json = zipfile_obj.open("floors.json").read()
            rooms_json = zipfile_obj.open("rooms.json").read()
            desks_json = zipfile_obj.open("desks.json").read()

            floor = [de.object for de in serializers.deserialize('json', floors_json)][0]
            rooms = [de.object for de in serializers.deserialize('json', rooms_json)]
            desks = [de.object for de in serializers.deserialize('json', desks_json)]

            iamge_name = str(floor.image)
            image_bytes = zipfile_obj.read(iamge_name)

            floor.pk = None
            floor._state.adding = True
            floor.image = ImageFile(io.BytesIO(image_bytes), name=iamge_name)
            floor.save()

            room_pk_map = {}
            for room in rooms:
                previous_pk = room.pk

                room.pk = None
                room.floor = floor
                room._state.adding = True
                room.save()

                room_pk_map[previous_pk] = room

            for desk in desks:
                desk.pk = None
                desk.room = room_pk_map[desk.room_id]
                desk._state.adding = True
                desk.save()

        return self.get(request, *args, **kwargs)

    def get(self, request, *arg, **kwargs):
        download = request.GET.get('download')
        if download is not None:
            floor = get_object_or_404(Floor, id=download)
            rooms = Room.objects.filter(floor=floor.id)
            desks = Desk.objects.filter(room__floor=floor.id)

            serialized_floor = serializers.serialize('json', [floor])
            serialized_rooms = serializers.serialize('json', rooms)
            serialized_desks = serializers.serialize('json', desks)

            zip_buffer = io.BytesIO()
            with zipfile.ZipFile(zip_buffer, "a", zipfile.ZIP_DEFLATED, False) as zip_file:
                zip_file.writestr('floors.json', serialized_floor)
                zip_file.writestr('rooms.json', serialized_rooms)
                zip_file.writestr('desks.json', serialized_desks)
                zip_file.write(floor.image.path, basename(floor.image.path))

            response = HttpResponse(zip_buffer.getvalue(), content_type='application/zip')
            response['Content-Disposition'] = 'attachment; filename="{}.mspd"'.format(floor.name)
            return response

        return super().get(request, *arg, **kwargs)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['floors'] = Floor.objects.all()
        return context
