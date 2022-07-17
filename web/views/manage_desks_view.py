from django.views.generic import TemplateView
from core.models import Floor, Room, Desk
from django.shortcuts import get_object_or_404
from django.contrib.auth.mixins import LoginRequiredMixin, PermissionRequiredMixin


class ManageDesksView(LoginRequiredMixin, PermissionRequiredMixin, TemplateView):
    template_name = 'web/manage_desks.html'
    permission_required = 'is_staff'

    def post(self, request, floor_id, *args, **kwargs):
        floor = get_object_or_404(Floor, id=floor_id)

        action = request.POST.get('action')
        if action is None:
            return self.get(request, floor_id=floor_id, *args, **kwargs)

        if action == 'new-room':
            room_name = request.POST.get('room-name')
            Room.objects.create(
                floor=floor,
                name=room_name,
            )
        elif action == 'new-desk':
            room_id = request.POST.get('room-id')
            desk_name = request.POST.get('desk-name')
            room = get_object_or_404(Room, id=room_id)
            Desk.objects.create(
                room=room,
                name=desk_name,
                width=100,
                height=100,
                pos_x=100,
                pos_y=100,
                orientation=0,
                is_blocked=False,
            )
        elif action == 'save-desks':
            desks = Desk.objects.filter(room__floor=floor)
            for desk in desks:
                desk.width = float(request.POST.get(str(desk.id) + '.width'))
                desk.height = float(request.POST.get(str(desk.id) + '.height'))
                desk.pos_x = float(request.POST.get(str(desk.id) + '.pos_x'))
                desk.pos_y = float(request.POST.get(str(desk.id) + '.pos_y'))
                desk.orientation = float(request.POST.get(str(desk.id) + '.orientation'))
                desk.save()
        elif action == 'delete-desk':
            desk_id = request.POST.get('desk-id')
            desk = get_object_or_404(Desk, id=desk_id)
            desk.delete()
        elif action == 'delete-room':
            room_id = request.POST.get('room-id')
            room = get_object_or_404(Room, id=room_id)
            room.delete()
        return self.get(request, floor_id=floor_id, *args, **kwargs)

    def get_context_data(self, floor_id, **kwargs):
        context = super().get_context_data(**kwargs)
        context['floor'] = get_object_or_404(Floor, id=floor_id)
        context['rooms'] = Room.objects.filter(floor=floor_id).prefetch_related('desks')
        context['desks'] = Desk.objects.filter(room__floor=floor_id)
        return context
