from django.urls import path

from .views.bookings_view import BookingsView
from .views.dashboard_view import DashboardView
from .views.display_view import DisplayView
from .views.initi_view import init_view
from .views.desk_view import DeskView
from .views.login_view import LoginView
from .views.logout_view import logout_view
from .views.manage_floors_view import ManageFloorsView
from .views.password_view import PasswordView
from .views.set_prefs_view import set_prefs_view
from .views.changelog_view import ChangelogView

urlpatterns = [
    path('', DashboardView.as_view(), name='dashboard'),
    path('bookings', BookingsView.as_view(), name='bookings'),
    path('password', PasswordView.as_view(), name='password'),
    path('desks/<int:id>', DeskView.as_view(), name='desk'),
    path('login', LoginView.as_view(), name='login'),
    path('logout', logout_view, name='logout'),
    path('init', init_view, name='init'),
    path('display/<str:key>', DisplayView.as_view(), name='display'),
    path('prefs/view/<str:view>', set_prefs_view, name='set_prefs_view'),
    path('changelog', ChangelogView.as_view(), name='changelog'),
    path('manage-floors', ManageFloorsView.as_view(), name='manage-floors'),
]
