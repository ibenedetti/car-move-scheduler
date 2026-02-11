from rest_framework import serializers
from .models import TransportSchedule

class TransportScheduleSerializer(serializers.ModelSerializer):
    """Serializer for TransportSchedule model"""
    
    assigned_driver_name = serializers.CharField(
        source='assigned_driver.get_full_name',
        read_only=True
    )
    status_display = serializers.CharField(
        source='get_status_display',
        read_only=True
    )
    
    class Meta:
        model = TransportSchedule
        fields = [
            'id',
            'vehicle_info',
            'plate',
            'email',
            'phone',
            'pickaddress',  
            'dropaddress',
            'scheduled_date',
            'comments',
            'assigned_driver',
            'assigned_driver_name',
            'status',
            'status_display',
            'google_calendar_event_id',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']
    
    def validate_plate(self, value):
        """Ensure plate is uppercase"""
        return value.upper()