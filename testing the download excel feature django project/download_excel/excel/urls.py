from . import views
from django.urls import path

urlpatterns = [
    path('', views.export_users_xls, name='export_users_xls'),
]
