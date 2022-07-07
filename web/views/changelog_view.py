from django.views.generic import TemplateView
from markdown import markdown


class ChangelogView(TemplateView):
    template_name = 'web/changelog.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        with open('./CHANGELOG.md', 'r') as changelog_file:
            context['changelog'] = markdown(changelog_file.read())

        return context
