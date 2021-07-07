from django.contrib import admin
from .models import Role, Lecturer

admin.site.register(Lecturer)
admin.site.register(Role)


#
# @admin.register(Lecturer)
# class LecturerAdmin(admin.ModelAdmin):
#     list_display = ("lecturer", "role")
#
#     search_fields = ["user__username"]
