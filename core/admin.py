from django.contrib import admin
from .models import Access, Booking, Desk, DisplayKey, Floor, Preferences, Room
from django.urls import reverse
from django.utils.safestring import mark_safe


@admin.register(Access)
class AccessAdmin(admin.ModelAdmin):
    list_filter = ['user', 'floor']
    list_display = ['id', 'user', 'floor']


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_filter = ['user', 'desk']
    list_display = ['id', 'user', 'desk', 'date']


@admin.register(Desk)
class DeskAdmin(admin.ModelAdmin):
    list_filter = ['room']
    list_display = ['name', 'room', 'get_floor']

    def get_floor(self, obj):
        return obj.room.floor

    get_floor.short_description = 'Floor'
    get_floor.admin_order_field = 'room__floor'


@admin.register(DisplayKey)
class DisplayKeyAdmin(admin.ModelAdmin):
    list_filter = (
        ('floor', admin.RelatedOnlyFieldListFilter),
    )
    list_display = ('id', 'floor')

    readonly_fields = ('display_key_url',)

    @admin.display(description='URL')
    def display_key_url(self, obj):
        url = reverse('display', kwargs={'key': str(obj.id)})
        return mark_safe('<a href="{0}" target="_blank">{0}</a>'.format(url))


@admin.register(Floor)
class FloorAdmin(admin.ModelAdmin):
    pass


@admin.register(Preferences)
class PreferencesAdmin(admin.ModelAdmin):
    pass


@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_filter = ['floor']
    list_display = ['name', 'floor']
