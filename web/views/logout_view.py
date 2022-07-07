from django.contrib.auth import logout
from django.shortcuts import redirect
from django.urls import reverse
from django.contrib.auth.decorators import login_required


@login_required()
def logout_view(request):
    logout(request)
    return redirect(reverse('login'))
