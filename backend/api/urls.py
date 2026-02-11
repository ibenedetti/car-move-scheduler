from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TransportScheduleViewSet

router = DefaultRouter()
router.register(r'schedules', TransportScheduleViewSet, basename='schedule')

urlpatterns = [
    path('', include(router.urls)),
]

