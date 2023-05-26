from django.urls import path
from rest_framework import routers

from api.views.data_views.access_view_set import AccessViewSet
from api.views.auth_view import AuthView
from api.views.data_views.desk_booking_view_set import DeskBookingViewSet
from api.views.data_views.desk_view_set import DeskViewSet
from api.views.data_views.display_key_view_set import DisplayKeyViewSet
from api.views.data_views.floor_view_set import FloorViewSet
from api.views.data_views.room_booking_view_set import RoomBookingViewSet
from api.views.data_views.room_view_set import RoomViewSet
from api.views.data_views.system_config_view_set import SystemConfigViewSet
from api.views.data_views.user_config_view_set import UserConfigViewSet
from api.views.data_views.user_view_set import UserViewSet
from api.views.display_view import DisplayView

router = routers.SimpleRouter()
router.register(r'accesses', AccessViewSet, basename='accesses')
router.register(r'desk-bookings', DeskBookingViewSet, basename='desk-bookings')
router.register(r'desks', DeskViewSet, basename='desks')
router.register(r'display-keys', DisplayKeyViewSet, basename='display-keys')
router.register(r'floors', FloorViewSet, basename='floors')
router.register(r'room-bookings', RoomBookingViewSet, basename='room-bookings')
router.register(r'rooms', RoomViewSet, basename='rooms')
router.register(r'system-configs', SystemConfigViewSet, basename='system-configs')
router.register(r'user-configs', UserConfigViewSet, basename='user-configs')
router.register(r'users', UserViewSet, basename='users')

urlpatterns = [
                  path('auth/', AuthView.as_view()),
                  path('display/<str:display_key>/', DisplayView.as_view()),
              ] + router.urls
