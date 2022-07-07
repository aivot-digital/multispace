from django.views.generic import TemplateView
from django.contrib.auth.mixins import LoginRequiredMixin


class PasswordView(LoginRequiredMixin, TemplateView):
    template_name = 'web/password.html'

    def post(self, request, **kwargs):
        password = request.POST['password']
        retyped_password = request.POST['retyped_password']

        context = self.get_context_data(**kwargs)

        if password != retyped_password:
            context['invalid'] = True
        else:
            request.user.set_password(password)
            request.user.save()
            context['success'] = True
        return self.render_to_response(context)
