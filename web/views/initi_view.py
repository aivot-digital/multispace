from django.shortcuts import redirect
from django.urls import reverse
from django.contrib.auth.models import User


def init_view(request):
    if not User.objects.filter(is_superuser=True).exists():
        User.objects.create_user('msadmin', password='multispace', is_superuser=True, is_staff=True, is_active=True)
    return redirect(reverse('login'))
