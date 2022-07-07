from django.views.generic import TemplateView
from django.contrib.auth import authenticate, login
from django.shortcuts import redirect
from django.urls import reverse


class LoginView(TemplateView):
    template_name = 'web/login.html'

    def post(self, request, *args, **kwargs):
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            next_path = request.GET.get('next', reverse('dashboard'))
            return redirect(next_path)
        else:
            context = self.get_context_data(**kwargs)
            context['invalid'] = True
            context['username'] = username
            return self.render_to_response(context)
