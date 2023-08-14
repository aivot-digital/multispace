from django.contrib import admin

from .models import SystemConfig, Floor, Desk, Room, DeskBooking, RoomBooking, DisplayKey, Access, UserConfig


@admin.register(SystemConfig)
class SystemConfigAdmin(admin.ModelAdmin):
    pass


@admin.register(Floor)
class FloorAdmin(admin.ModelAdmin):
    pass


@admin.register(Desk)
class DeskAdmin(admin.ModelAdmin):
    pass


@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    pass


@admin.register(DeskBooking)
class DeskBookingAdmin(admin.ModelAdmin):
    pass


@admin.register(RoomBooking)
class RoomBookingAdmin(admin.ModelAdmin):
    pass


@admin.register(DisplayKey)
class DisplayKeyAdmin(admin.ModelAdmin):
    pass


@admin.register(Access)
class AccessAdmin(admin.ModelAdmin):
    pass


@admin.register(UserConfig)
class UserConfigAdmin(admin.ModelAdmin):
    pass
