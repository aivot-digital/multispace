from django.views.generic import TemplateView
from core.models import Booking
from django.utils import timezone
from django.contrib.auth.mixins import LoginRequiredMixin


class BookingsView(LoginRequiredMixin, TemplateView):
    template_name = 'web/bookings.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['user'] = self.request.user

        date = timezone.now().replace(hour=0, minute=0, second=0, microsecond=0)
        context['bookings'] = Booking.objects.filter(user=self.request.user, date__gte=date).order_by('date')

        return context
