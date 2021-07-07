from rest_framework import serializers
from .models import Assessment_Results, Result, CA_Item, Lecture_Course, Assessment, CourseWorkAssessment


class ResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = Result
        fields = ['id', 'first_question', 'second_question',
                  'third_question', 'fourth_question']


class CA_ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = CA_Item
        fields = ['ca_item_name']


class LecturerCourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lecture_Course
        fields = ['lecturer', 'course', 'academic_year']


class AssessmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assessment
        fields = ['id', 'criteria', 'course', 'academic_year',
                  'date_taken', 'number_of_questions', 'contribution']


class AssessmentResultsSerializer(serializers.ModelSerializer):
    assessment = AssessmentSerializer(many=False, read_only=True)

    class Meta:
        model = Assessment_Results
        fields = ['id', 'assessment', 'semester',
                  'course_type', 'year_of_study', 'academic_year', 'student', 'score']

class CourseWorkAssessmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseWorkAssessment
        fields = ['id', 'student', 'course', 'year_of_study', 'semester', 'academic_year', 'ca']