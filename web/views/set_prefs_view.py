from django.shortcuts import redirect
from django.urls import reverse
from django.contrib.auth.decorators import login_required


@login_required()
def set_prefs_view(request, view):
    request.user.preferences.view = view
    request.user.preferences.save()
    return redirect(request.GET.get('next', reverse('dashboard')))
