from django.views.generic import TemplateView
from core.models import Floor, Room, Desk, Booking
from django.utils import timezone
from datetime import datetime
from django.db.models import Prefetch


class DisplayView(TemplateView):
    template_name = 'web/display.html'

    def get_context_data(self, key, **kwargs):
        context = super().get_context_data(**kwargs)

        if 'date' in self.request.GET:
            date = datetime.fromisoformat(self.request.GET.get('date'))
        else:
            date = timezone.now().replace(hour=0, minute=0, second=0, microsecond=0)
        context['date'] = date

        bookings_queryset = Booking.objects.filter(date=date)
        desks_queryset = Desk.objects.prefetch_related(Prefetch(
            'bookings',
            queryset=bookings_queryset,
        ))
        rooms_queryset = Room.objects.prefetch_related(Prefetch(
            'desks',
            queryset=desks_queryset,
        ))
        context['floors'] = Floor.objects \
            .filter(display_keys__id=key) \
            .prefetch_related(Prefetch(
                'rooms',
                queryset=rooms_queryset,
            ))
        return context
