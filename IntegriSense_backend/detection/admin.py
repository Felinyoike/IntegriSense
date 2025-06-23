from django.contrib import admin
from .models import SensorData

@admin.register(SensorData)
class SensorDataAdmin(admin.ModelAdmin):
    list_display = ('device_id', 'timestamp', 'bpm', 'voice_pitch', 'label')
    list_filter = ('label', 'device_id')
    search_fields = ('device_id',)
    ordering = ('-timestamp',)
    date_hierarchy = 'timestamp'
