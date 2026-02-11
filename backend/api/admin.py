from django.contrib import admin
from django.utils.html import format_html
from .models import TransportSchedule

@admin.register(TransportSchedule)
class TransportScheduleAdmin(admin.ModelAdmin):
    """Admin interface for managing transport schedules"""
    
    list_display = [
        'vehicle_display', 
        'plate', 
        'scheduled_date', 
        'status_badge',
        'assigned_driver',
        'contact_info',
        'created_at'
    ]
    
    list_filter = [
        'status', 
        'scheduled_date', 
        'assigned_driver',
        'created_at'
    ]
    
    search_fields = [
        'vehicle_info', 
        'plate', 
        'email', 
        'phone',
        'address'
    ]
    
    readonly_fields = [
        'google_calendar_event_id',
        'created_at', 
        'updated_at'
    ]
    
    fieldsets = (
        ('Información del Vehículo', {
            'fields': ('vehicle_info', 'plate')
        }),
        ('Datos de Contacto', {
            'fields': ('email', 'phone', 'address')
        }),
        ('Programación', {
            'fields': ('scheduled_date', 'comments')
        }),
        ('Gestión Interna', {
            'fields': ('status', 'assigned_driver')
        }),
        ('Integración', {
            'fields': ('google_calendar_event_id',),
            'classes': ('collapse',)
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['mark_as_completed', 'mark_as_in_progress', 'mark_as_cancelled']
    
    def vehicle_display(self, obj):
        """Display vehicle info with formatting"""
        return format_html(
            '<strong>{}</strong>',
            obj.vehicle_info
        )
    vehicle_display.short_description = 'Vehículo'
    
    def status_badge(self, obj):
        """Display status with color-coded badge"""
        colors = {
            'pending': '#fbbf24',      
            'assigned': '#3b82f6',     
            'in_progress': '#8b5cf6',  
            'completed': '#10b981',    
            'cancelled': '#ef4444',    
        }
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 10px; '
            'border-radius: 12px; font-size: 11px; font-weight: bold;">{}</span>',
            colors.get(obj.status, '#6b7280'),
            obj.get_status_display()
        )
    status_badge.short_description = 'Estado'
    
    def contact_info(self, obj):
        """Display contact information"""
        return format_html(
            '📧 {}<br/>📱 {}',
            obj.email,
            obj.phone
        )
    contact_info.short_description = 'Contacto'
    
    def mark_as_completed(self, request, queryset):
        """Mark selected schedules as completed"""
        updated = queryset.update(status='completed')
        self.message_user(
            request, 
            f'{updated} solicitud(es) marcada(s) como completada(s).'
        )
    mark_as_completed.short_description = "✓ Marcar como completado"
    
    def mark_as_in_progress(self, request, queryset):
        """Mark selected schedules as in progress"""
        updated = queryset.update(status='in_progress')
        self.message_user(
            request, 
            f'{updated} solicitud(es) marcada(s) en progreso.'
        )
    mark_as_in_progress.short_description = "⟳ Marcar en progreso"
    
    def mark_as_cancelled(self, request, queryset):
        """Mark selected schedules as cancelled"""
        updated = queryset.update(status='cancelled')
        self.message_user(
            request, 
            f'{updated} solicitud(es) cancelada(s).'
        )
    mark_as_cancelled.short_description = "✕ Marcar como cancelado"