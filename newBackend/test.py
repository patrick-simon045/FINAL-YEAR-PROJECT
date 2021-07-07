from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from backendapi.models import *


def get_user_from_token(token):
    user = Token.objects.get(pk=token).user
    print(user)
    return user


def get_lecturer_from_user(user):
    lecturer = Lecturer.objects.get(lecturer=user)
    print(lecturer.role)
    return lecturer


def get_courses_assigned_to_a_lecturer(lecturer):
    lecturer_course = Lecture_Course.objects.filter(lecturer=lecturer)
    print(lecturer_course)
    courses = get_list_of_courses_for_a_lecturer(lecturer_course)
    print(courses)
    return courses


def get_assessment_results(student):
    assessment_results = Assessment_Results.objects.all()
    print(assessment_results)

    # student = Student.objects.get(regno='2017-04-06858')

    # students & scores
    # students
    students = set()

    # scores
    scores = set()

    for assessment_result in assessment_results:
        if search(assessment_results, student):
            students.add(assessment_result.student.regno)
            print("reg numbers: {}".format(assessment_result.student.regno))
            scores.add(assessment_result.score)
            print("student scores: {}".format(assessment_result.student.score))

    students_list = list(students)
    scores_list = list(scores)
    print(students_list)
    print(scores_list)


# helper functions
def get_list_of_courses_for_a_lecturer(list):
    courses = []
    for list in list:
        courses.append(list.course.course_code)
    return courses


def search(list, value):
    for i in range(len(list)):
        if list[i].student == value:
            return True
    return False


# user = get_user_from_token('94f7ee855b2bd3a53335450e22f5a7f676e065c2')
#
# lecturer = get_lecturer_from_user(user)
#
# lecturer_course = get_courses_assigned_to_a_lecturer(lecturer)

get_assessment_results(Student.objects.get(regno='2017-04-06858'))
