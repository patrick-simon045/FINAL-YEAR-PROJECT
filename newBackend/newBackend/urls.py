from django.contrib import admin
from rest_framework.authtoken.views import obtain_auth_token
from django.urls import path, include
from backendapi import urls
from backendapi import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', admin.site.urls),
    # path('', views.export_users_xls, name='export_excel'),
    path('api/', include(urls)),
    path('token_auth/', obtain_auth_token, name='token_auth'),
]
