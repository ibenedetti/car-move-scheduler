from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authentication import TokenAuthentication
from django.contrib.auth.models import User
from .models import TransportSchedule
from .serializers import TransportScheduleSerializer

class TransportScheduleViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing transport schedules
    
    Endpoints:
    - GET /api/schedules/ - List all schedules
    - POST /api/schedules/ - Create new schedule (PUBLIC - no auth required)
    - GET /api/schedules/{id}/ - Get specific schedule
    - PUT/PATCH /api/schedules/{id}/ - Update schedule
    - DELETE /api/schedules/{id}/ - Delete schedule
    - POST /api/schedules/{id}/assign_driver/ - Assign driver
    """
    
    queryset = TransportSchedule.objects.all()
    serializer_class = TransportScheduleSerializer
    authentication_classes = [TokenAuthentication]
    
    def get_permissions(self):
        """
        Allow anyone to create schedules (POST)
        Require authentication for everything else
        """
        if self.action == 'create':
            return [AllowAny()]
        return [IsAuthenticated()]
    
    def get_queryset(self):
        """
        Optionally filter by status or assigned driver
        """
        queryset = TransportSchedule.objects.all()
        
        status_param = self.request.query_params.get('status', None)
        if status_param:
            queryset = queryset.filter(status=status_param)
        
        driver_param = self.request.query_params.get('driver', None)
        if driver_param:
            queryset = queryset.filter(assigned_driver_id=driver_param)
        
        date_from = self.request.query_params.get('date_from', None)
        date_to = self.request.query_params.get('date_to', None)
        
        if date_from:
            queryset = queryset.filter(scheduled_date__gte=date_from)
        if date_to:
            queryset = queryset.filter(scheduled_date__lte=date_to)
        
        return queryset
    
    @action(detail=True, methods=['post'])
    def assign_driver(self, request, pk=None):
        """
        Assign a driver to a transport schedule
        POST /api/schedules/{id}/assign_driver/
        Body: {"driver_id": 123}
        """
        schedule = self.get_object()
        driver_id = request.data.get('driver_id')
        
        if not driver_id:
            return Response(
                {'error': 'driver_id is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            driver = User.objects.get(
                id=driver_id,
                groups__name='conductores'
            )
            schedule.assigned_driver = driver
            schedule.status = 'assigned'
            schedule.save()
            
            serializer = self.get_serializer(schedule)
            return Response(serializer.data)
            
        except User.DoesNotExist:
            return Response(
                {'error': 'Driver not found or not in conductores group'}, 
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        """
        Update schedule status
        POST /api/schedules/{id}/update_status/
        Body: {"status": "in_progress"}
        """
        schedule = self.get_object()
        new_status = request.data.get('status')
        
        valid_statuses = [choice[0] for choice in TransportSchedule.STATUS_CHOICES]
        
        if new_status not in valid_statuses:
            return Response(
                {'error': f'Invalid status. Valid options: {valid_statuses}'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        schedule.status = new_status
        schedule.save()
        
        serializer = self.get_serializer(schedule)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def pending(self, request):
        """
        Get all pending schedules
        GET /api/schedules/pending/
        """
        pending_schedules = self.queryset.filter(status='pending')
        serializer = self.get_serializer(pending_schedules, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def my_assignments(self, request):
        """
        Get schedules assigned to the current user
        GET /api/schedules/my_assignments/
        """
        my_schedules = self.queryset.filter(assigned_driver=request.user)
        serializer = self.get_serializer(my_schedules, many=True)
        return Response(serializer.data)