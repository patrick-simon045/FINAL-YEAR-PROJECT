from django.urls import include, path
from rest_framework import routers

from . import views

router = routers.DefaultRouter()
router.register(r'results', views.ResultsViewset)
router.register(r'ca_items', views.CA_ItemsViewset)

urlpatterns = [
    path('', include(router.urls)),
    path('lecturers/', views.lecturer_details, name='lecturers'),
    path('assessments/', views.assessment_details, name='assessments'),
    path('assessments_change/<int:pk>',
         views.assessment_details_update_delete, name='assessments_change'),
    path('assessment_results/', views.assessment_results,
         name='assessment_results'),
    path('assessment_results_update/<int:pk>', views.assessment_results_update,
         name='assessment_result_update'),
    path('get_ca_report/', views.get_ca_report,
         name='get_ca_report'),
    path('download_ca_report/', views.download_ca_report,
         name='download_ca_report'),
]
