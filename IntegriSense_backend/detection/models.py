from django.db import models
from django.core.exceptions import ValidationError
import re

class SensorData(models.Model):
    device_id = models.CharField(max_length=50)
    bpm = models.FloatField()
    blood_pressure = models.CharField(max_length=20)
    voice_pitch = models.FloatField(help_text="Pitch in Hz")
    shaking = models.FloatField(help_text="Movement intensity")
    label = models.CharField(
        max_length=10,
        null=True,
        blank=True,
        choices=[('truth', 'Truth'), ('lie', 'Lie')]
    )
    timestamp = models.DateTimeField(auto_now_add=True)
    
    def clean(self):
        super().clean()
        if self.blood_pressure and not re.match(r'^\d{2,3}/\d{2,3}$', self.blood_pressure):
            raise ValidationError('Blood pressure must be in format "120/80"')
    
    def __str__(self):
        return f"{self.device_id} at {self.timestamp} - {self.label or 'Unlabeled'}"

    class Meta:
        ordering = ['-timestamp']
        verbose_name = "Sensor Data"
        verbose_name_plural = "Sensor Data Records"