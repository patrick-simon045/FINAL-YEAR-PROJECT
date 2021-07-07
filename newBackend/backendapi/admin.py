from django.contrib import admin
from .models import *


# class LecturerCriteriaAdmin(admin.ModelAdmin):
#     list_display = ('lecturer', 'assessmentCriteria', 'ca_contribution')
#
#
# admin.site.register(LecturerCriteria, LecturerCriteriaAdmin)


# admin.site.register(Lecturer)
class LecturerAdmin(admin.ModelAdmin):
    list_display = ('lecturer', 'role')


admin.site.register(Lecturer, LecturerAdmin)

class CourseWorkAssessmentAdmin(admin.ModelAdmin):
    list_display = ('student', 'course', 'year_of_study', 'semester', 'academic_year', 'ca')


admin.site.register(CourseWorkAssessment, CourseWorkAssessmentAdmin)

admin.site.register(Role)


# admin.site.register(Result)
class ResultAdmin(admin.ModelAdmin):
    list_display = ('name', 'first_question', 'second_question',
                    'third_question', 'fourth_question', 'sum')
    list_filter = ('name', 'first_question')
    readonly_fields = ['sum']


admin.site.register(Result, ResultAdmin)

admin.site.register(Program)


# admin.site.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('course_code', 'course_name', 'credits')


admin.site.register(Course, CourseAdmin)


# admin.site.register(Program_Course)
class Program_CourseAdmin(admin.ModelAdmin):
    list_display = ('course', 'program', 'academic_year',
                    'semester', 'course_type', 'year_of_study')
    list_filter = ('program', 'course_type', 'year_of_study',
                   'semester', 'academic_year')


admin.site.register(Program_Course, Program_CourseAdmin)


# admin.site.register(Lecture_Course)

class Lecture_CourseAdmin(admin.ModelAdmin):
    list_display = ('lecturer', 'course', 'academic_year')


admin.site.register(Lecture_Course, Lecture_CourseAdmin)


# admin.site.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'regno', 'program')


admin.site.register(Student, StudentAdmin)

admin.site.register(CA_Item)


# admin.site.register(Assessment)
class AssessmentAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'course', 'criteria', 'contribution', 'academic_year', 'number_of_questions', 'date_taken')
    list_filter = ('criteria', 'academic_year')


admin.site.register(Assessment, AssessmentAdmin)


# admin.site.register(Assessment_Results)
class Assessment_ResultsAdmin(admin.ModelAdmin):
    list_display = ('id', 'assessment', 'student', 'semester',
                    'course_type', 'year_of_study', 'academic_year', 'score')


admin.site.register(Assessment_Results, Assessment_ResultsAdmin)

admin.site.register(UE)
admin.site.register(UE_Results)


class CAAdmin(admin.ModelAdmin):
    list_display = ('student', 'course', 'ca', 'academic_year')
    list_filter = ('course', 'academic_year')


admin.site.register(CA, CAAdmin)
