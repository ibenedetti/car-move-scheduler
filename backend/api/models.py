from django.db import models
from django.contrib.auth.models import User

class TransportSchedule(models.Model):
    """Model to store vehicle transport scheduling requests"""
    
    STATUS_CHOICES = [
        ('pending', 'Pendiente'),
        ('assigned', 'Asignado'),
        ('in_progress', 'En Progreso'),
        ('completed', 'Completado'),
        ('cancelled', 'Cancelado'),
    ]
    
    # INFO
    vehicle_info = models.CharField(max_length=200, verbose_name="Información del Vehículo")
    plate = models.CharField(max_length=20, verbose_name="Matrícula")
    
    # CONTACT
    email = models.EmailField(verbose_name="Email de Contacto")
    phone = models.CharField(max_length=20, verbose_name="Teléfono")
    pickaddress = models.TextField(verbose_name="Dirección de Recogida")
    dropaddress = models.TextField(verbose_name="Dirección de Entrega")
    
    # SCHEDULE
    scheduled_date = models.DateField(verbose_name="Fecha Estimada de Recepción")
    comments = models.TextField(blank=True, verbose_name="Notas Especiales")
    
    # ASSIGNING
    assigned_driver = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        limit_choices_to={'groups__name': 'conductores'},
        verbose_name="Conductor Asignado",
        related_name='assigned_transports'
    )
    status = models.CharField(
        max_length=20, 
        choices=STATUS_CHOICES, 
        default='pending',
        verbose_name="Estado"
    )
    
    
    google_calendar_event_id = models.CharField(
        max_length=200, 
        blank=True,
        verbose_name="ID del Evento en Google Calendar"
    )
    
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de Creación")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Última Actualización")
    
    class Meta:
        verbose_name = "Solicitud de Traslado"
        verbose_name_plural = "Solicitudes de Traslado"
        ordering = ['-created_at']
        
    def __str__(self):
        return f"{self.vehicle_info} [{self.plate}] - {self.scheduled_date}"
    
    def save(self, *args, **kwargs):
        """Auto-update status when driver is assigned"""
        if self.assigned_driver and self.status == 'pending':
            self.status = 'assigned'
        super().save(*args, **kwargs)