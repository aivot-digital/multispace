from django.views.generic import TemplateView
from core.models import Floor, Room, Desk, Booking
from django.utils import timezone
from datetime import datetime
from django.db.models import Prefetch
from django.contrib.auth.mixins import LoginRequiredMixin


class DashboardView(LoginRequiredMixin, TemplateView):
    template_name = 'web/dashboard.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['user'] = self.request.user
        context['prefs'] = self.request.user.preferences

        if 'date' in self.request.GET:
            date = datetime.fromisoformat(self.request.GET.get('date'))
        else:
            date = timezone.now().replace(hour=0, minute=0, second=0, microsecond=0)
        context['date'] = date
        context['tomorrow'] = date + timezone.timedelta(days=1)
        context['yesterday'] = date - timezone.timedelta(days=1)

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
            .filter(accesses__user=self.request.user) \
            .prefetch_related(Prefetch(
                'rooms',
                queryset=rooms_queryset,
            ))
        return context
