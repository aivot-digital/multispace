from django.views.generic import TemplateView
from core.models import Desk, Booking
from django.utils import timezone
from datetime import datetime, timedelta
from django.shortcuts import get_object_or_404
from calendar import monthcalendar
from django.contrib.auth.mixins import LoginRequiredMixin


class DeskView(LoginRequiredMixin, TemplateView):
    template_name = 'web/desk.html'

    def post(self, request, id, **kwargs):
        desk = get_object_or_404(Desk, id=id)

        context = self.get_context_data(id, **kwargs)

        date = request.POST['date']
        if Booking.objects.filter(desk=desk, date=date).exists():
            Booking.objects.filter(
                user=request.user,
                desk=desk,
                date=date,
            ).delete()
        else:
            Booking.objects.create(
                user=request.user,
                desk=desk,
                date=date,
            )
        return self.render_to_response(context)

    def get_context_data(self, id, **kwargs):
        context = super().get_context_data(**kwargs)
        context['user'] = self.request.user

        if 'date' in self.request.GET:
            date = datetime.fromisoformat(self.request.GET.get('date'))
        else:
            date = timezone.now().replace(hour=0, minute=0, second=0, microsecond=0)

        context['date'] = date
        context['tomorrow'] = date + timezone.timedelta(days=1)
        context['yesterday'] = date - timezone.timedelta(days=1)
        context['next_month'] = date.replace(month=date.month+1, day=1)
        context['previous_month'] = date.replace(month=date.month-1, day=1)

        desk = get_object_or_404(Desk, id=id)
        context['desk'] = desk
        context['bookings'] = desk.bookings.filter(date=date)

        context['month'] = []
        for week in monthcalendar(date.year, date.month):
            _week = []
            for day in week:
                if day == 0:
                    _week.append(None)
                else:
                    month_date = datetime(year=date.year, month=date.month, day=day)
                    month_tomorrow = month_date + timedelta(days=1)
                    _week.append({
                        'active': month_date == date,
                        'day': day,
                        'date': month_date,
                        'bookings': desk.bookings.filter(date__gte=month_date, date__lt=month_tomorrow),
                    })
            context['month'].append(_week)

        return context
