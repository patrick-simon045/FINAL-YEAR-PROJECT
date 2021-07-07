from django.contrib import admin
from django.urls import path

from excel import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.ExcelPageView.as_view(), name='home'),
    path('export/excel', views.export_users_xls, name='export_excel'),
]
