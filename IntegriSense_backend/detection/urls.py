from django.urls import path
from .views import upload_sensor_data, get_sensor_data

urlpatterns = [
    path('upload-data/', upload_sensor_data, name='upload-sensor-data'),
    path('get-data/', upload_sensor_data, name='get-sensor-data'),
]
