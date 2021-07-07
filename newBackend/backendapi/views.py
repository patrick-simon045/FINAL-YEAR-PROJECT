import xlwt
# from openpyxl import Workbook 
import xlsxwriter
import json
from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from rest_framework import status, viewsets, generics
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import AssessmentResultsSerializer, CourseWorkAssessmentSerializer, ResultSerializer, CA_ItemSerializer, LecturerCourseSerializer, AssessmentSerializer
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import authentication
from rest_framework.authtoken.models import Token
from .models import *


class ResultsViewset(viewsets.ModelViewSet):
    queryset = Result.objects.all()
    serializer_class = ResultSerializer
    permission_classes = [IsAuthenticated]


class CA_ItemsViewset(viewsets.ReadOnlyModelViewSet):
    queryset = CA_Item.objects.all()
    serializer_class = CA_ItemSerializer
    permission_classes = [IsAuthenticated]


def get_user_from_token(token):
    user = Token.objects.get(pk=token).user
    # print("username: {}".format(user))
    return user


def get_lecturer_from_user(user):
    lecturer = Lecturer.objects.get(lecturer=user)
    # print("lecturer role: {}".format(lecturer.role))
    return lecturer


def get_lecturer_name(lecturer):
    lecturer_first_name = lecturer.lecturer.first_name
    lecturer_last_name = lecturer.lecturer.last_name
    # print("lecturer name: {} {}".format(
    #     lecturer_first_name, lecturer_last_name))
    return "{} {}".format(lecturer_first_name, lecturer_last_name)


def get_courses_assigned_to_a_lecturer(lecturer):
    lecturer_course = Lecture_Course.objects.filter(lecturer=lecturer)
    # print('lecturer course: {}'.format(lecturer_course))
    courses = get_list_of_courses_for_a_lecturer(lecturer_course)
    # print("number of courses assigned to {}: {}".format(
    #     get_lecturer_name(lecturer), len(courses)))
    # print(courses)
    return courses


def get_list_of_courses_for_a_lecturer(list_of_lecturer_course_instance):
    courses = []
    for lecturer_course_instance in list_of_lecturer_course_instance:
        courses.append(
            {
                "course_code": lecturer_course_instance.course.course_code,
                "course_description": lecturer_course_instance.course.course_name
            }
        )
    return courses


def get_courses_as_list(token):
    user = get_user_from_token(token)
    lecturer = get_lecturer_from_user(user)
    courses = get_courses_assigned_to_a_lecturer(lecturer)

    courses_list = []
    for course in courses:
        courses_list.append(course["course_code"])

    return courses_list

#
#
# lecturer details api
#
#


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def lecturer_details(request):
    usernames = [user.username for user in User.objects.all()]
    print("token from request header: {}".format(
        request.META.get('HTTP_AUTHORIZATION')))
    authorization_token = request.META.get('HTTP_AUTHORIZATION')
    token = authorization_token[6:]

    try:
        user = get_user_from_token(token)
        lecturer = get_lecturer_from_user(user)
        lecturer_name = get_lecturer_name(lecturer)
        courses = get_courses_assigned_to_a_lecturer(lecturer)

        return Response({
            "user_name": lecturer.lecturer.username,
            "lecturer_name": lecturer_name,
            "courses_teaching": courses,
            "course_count": len(courses),
            "position": lecturer.role.role_name,
        })
    except ObjectDoesNotExist as error:
        print("no lecturer with such credentials")
        print("error message: {}".format(error))

    print("usernames: {}".format(usernames))

    return Response("Nothing to show")

#
#
# end lecturer api
#
#


#
#
# assessment results api
#
#

def get_Ca_Report(token):
    # CA_RESULT_ROWS = []
    # 1. Get the list of courses for that lecturer (should also consider the academic year)
    # 2. Get the list of students
    # 3. Get the list of assessments for each course
    # 4. Get the list of assessment-results for each assessment
    # 4. For each course, loop through the list of students where for each student,
    #    loop through the list of assessments where for each assessment,
    #    loop through the list of assessment-results to obtain the record given
    #    student=current student and assessment=current assessment,
    #    then append an object:
    #    {
    #       student: current student,
    #       assessment-result: current assessment-result
    #    },
    #
    #    to CA_RESULT_ROWS list

    # list of courses
    user = get_user_from_token(token)
    lecturer = get_lecturer_from_user(user)
    coursesList = Lecture_Course.objects.filter(lecturer=lecturer)
    # print(coursesList)

    # list of students
    student_course_dictionary = get_students(coursesList)
    # print(len(student_course_dictionary))

    # list of assessments
    course_assessment_dictionary = get_list_of_assessments(coursesList)
    # print("assessments: {}".format(assessments))

    CA_RESULT_ROWS = []

    for student in student_course_dictionary[0]["students"]:
        print("***")
        # print(student)
        for assessments in course_assessment_dictionary:
            total_score = 0
            course_code = ""
            for assessment in assessments:
                assessment_result = Assessment_Results.objects.get(
                    assessment=assessment, student=student)
                score = assessment_result.score
                CA_RESULT_ROWS_DICTIONARY = {
                    "student": student,
                    "assessment": assessment,
                    "score": score
                }
                CA_RESULT_ROWS.append(CA_RESULT_ROWS_DICTIONARY)
                total_score = total_score + score
                course_code = assessment_result.assessment.course.course_code

            res = {
                "student": student,
                "course": assessment_result.assessment.course.course_code,
                "ca": total_score
            }
            # print("res")
            # print(res)

            data = {
                "student": student,
                "course": assessment_result.assessment.course,
                "year of study": assessment_result.year_of_study,
                "semester": assessment_result.semester,
                "academic year": assessment_result.academic_year,
                "ca": total_score
            }

            # print(data)

            try:
                pk = CourseWorkAssessment.objects.get(
                    student=data["student"],
                    course=data["course"],
                    year_of_study=data["year of study"],
                    semester=data["semester"],
                    academic_year=data["academic year"],
                ).id
                a = CourseWorkAssessment.objects.get(pk=pk)
                a.ca=data["ca"]
                a.save()

            except (CourseWorkAssessment.DoesNotExist):
                CourseWorkAssessment.objects.get_or_create(
                    student=data["student"],
                    course=data["course"],
                    year_of_study=data["year of study"],
                    semester=data["semester"],
                    academic_year=data["academic year"],
                    ca=data["ca"]
                )
    return {
        "course_assessment_dictionary": course_assessment_dictionary,
        "CA_RESULT_ROWS": CA_RESULT_ROWS,
        "students": student_course_dictionary[0]["students"]
    }

    for item in course_assessment_dictionary:
        for another_item in item:
            # print(another_item)
            for result in CA_RESULT_ROWS:
                if result["assessment"] == another_item:
                    print(result)

            
def get_list_of_assessments(coursesList):
    assessmensts_list = []
    for course in coursesList:
        assessmnets = Assessment.objects.filter(course=course.course)
        course_assessment_dictionary = {
            "course": course,
            "assessments": assessmnets
        }

        # assessmensts_list.append(course_assessment_dictionary)
        assessmensts_list.append(assessmnets)

    return assessmensts_list


def get_students(coursesList):
    students = []
    for course in coursesList:
        programs = Program.objects.filter(course=course.course)
        students_list = Student.objects.filter(program__in=programs)
        student_course_dictionary = {
            "course": course,
            "students": students_list
        }
        students.append(student_course_dictionary)
    return students


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_ca_report(request):
    authorization_token = request.META.get('HTTP_AUTHORIZATION')
    token = authorization_token[6:]

    get_Ca_Report(token)

    try:
        courses_list = get_courses_as_list(token)
        course_work_results = CourseWorkAssessment.objects.filter(course__in=courses_list)
        serializer = CourseWorkAssessmentSerializer(course_work_results, many=True)

        return Response(serializer.data)

    except ObjectDoesNotExist as error:
        print("error message: {}".format(error))


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def assessment_results(request):
    authorization_token = request.META.get('HTTP_AUTHORIZATION')
    token = authorization_token[6:]

    if request.method == 'GET':
        try:
            courses_list = get_courses_as_list(token)
            assessments = Assessment.objects.filter(course__in=courses_list)
            assessment_results = Assessment_Results.objects.filter(
                assessment__in=assessments)
            serializer = AssessmentResultsSerializer(
                assessment_results, many=True)

            return Response(serializer.data)

        except ObjectDoesNotExist as error:
            print("error message: {}".format(error))

    elif request.method == "POST":
        serializer = AssessmentResultsSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def assessment_results_update(request, pk):
    try:
        assessment_result = Assessment_Results.objects.get(pk=pk)
    except Assessment_Results.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    serializer = AssessmentResultsSerializer(
        assessment_result, data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#
#
# end assessment results api
#
#


#
#
# assessment details api
#
#


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def assessment_details(request):
    authorization_token = request.META.get('HTTP_AUTHORIZATION')
    token = authorization_token[6:]

    if request.method == 'GET':
        try:
            user = get_user_from_token(token)
            lecturer = get_lecturer_from_user(user)
            courses = get_courses_assigned_to_a_lecturer(lecturer)

            courses_list = []
            for course in courses:
                courses_list.append(course["course_code"])

            assessments = Assessment.objects.filter(course__in=courses_list)
            serializer = AssessmentSerializer(assessments, many=True)
            return Response(serializer.data)

        except ObjectDoesNotExist as error:
            print("error message: {}".format(error))

    elif request.method == "POST":
        serializer = AssessmentSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["PUT", "DELETE"])
@permission_classes([IsAuthenticated])
def assessment_details_update_delete(request, pk):
    try:
        assessment = Assessment.objects.get(pk=pk)
    except Assessment.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "DELETE":
        assessment.delete()
        return Response({"message": "deleted successfully", "verified_by": "django"}, status=status.HTTP_204_NO_CONTENT)

    elif request.method == 'PUT':
        serializer = AssessmentSerializer(assessment, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#
#
# end assessment details api
#
#


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def download_ca_report(request):
    authorization_token = request.META.get('HTTP_AUTHORIZATION')
    token = authorization_token[6:]

    res = get_Ca_Report(token)

    request_body = json.loads(request.body)
    course_code = request_body["course"]

    data_for_excel = []

    for student in res["students"]:
        for result in res["CA_RESULT_ROWS"]:
            initial_data_for_excel = []
            if student == result["student"] and course_code == result["assessment"].course.course_code:
                data_for_excel.append(result)
    data_for_excel.append(initial_data_for_excel)    


    response = HttpResponse(content_type='application/ms-excel')
    response['Content-Disposition'] = 'attachment; filename="users.xls"'

    wb = xlwt.Workbook(encoding='utf-8')
    ws = wb.add_sheet('Black Sheet')

    

    font_style = xlwt.XFStyle()
    font_style.font.bold = True

    columns = ['Username', 'First name', 'Last name', 'Email address', ]

    # colums
    newColumns = ["Registration Number"]

    my_dictionary = res["course_assessment_dictionary"]
    for assessments in my_dictionary:
        for assessment in assessments:
            if assessment.course.course_code == course_code:
                newColumns.append(str(assessment.criteria.ca_item_name))

    print(newColumns)

    # rows
    excel_rows = tuple()

    for student in res["students"]:
        for data in data_for_excel:
            try:
                if student == data["student"] and course_code == data["assessment"].course.course_code and data != []:
                    # print(data)
                    y = list(excel_rows)
                    y.append(data)
                    excel_rows = tuple(y)

            except:
                pass
                
 

    # row data
    rows_to_display = []
    for student in res["students"]:
        p = []
        p.append(str(student.regno))
        for a in excel_rows:
            if a["student"].regno == student.regno:
                p.append(int(a["score"]))
                

        rows_to_display.append(tuple(p))

    print("rows_to_display")
    print(rows_to_display)



    # Sheet header 1
    header1 = "UNIVERSITY OF DAR ES SALAAM"
    first_cell_row = 1
    last_cell_row = 1
    first_cell_column = 0
    last_cell_column = len(newColumns) - 1
    ws.write_merge(first_cell_row,last_cell_row,first_cell_column,last_cell_column, header1, xlwt.easyxf("align: horiz center; font: bold on, height 250;"))
    
    # Sheet header 2
    header2 = "STUDENT CONTINUOUS ASSESSMENT (CA) REPORT"
    first_cell_row = 2
    last_cell_row = 2
    first_cell_column = 0
    last_cell_column = len(newColumns) - 1
    ws.write_merge(first_cell_row,last_cell_row,first_cell_column,last_cell_column, header2, xlwt.easyxf("align: horiz center"))
    
        
    # Sheet header 3
    header3 = "DEGREE PROGRAMME"
    ws.write(3, 0, header3, xlwt.easyxf("align: horiz left;align: horiz left;"))
    
    # Sheet header 3 value
    header3value = "CEIT"
    ws.write(3, 1, header3value, xlwt.easyxf("align: horiz left;align: horiz left;"))
    
    # Sheet header 4
    header4 = "YEAR OF STUDY"
    ws.write(3, 2, header4, xlwt.easyxf("align: horiz left;align: horiz left;"))
    
    # Sheet header 4 value
    header4value = "II"
    ws.write(3, 3, header4value, xlwt.easyxf("align: horiz left;align: horiz center;"))
    
    # Sheet header 5
    header5 = "DATE OF EXAMINATION"
    ws.write(4, 0, header5, xlwt.easyxf("align: horiz left;align: horiz left;"))
    
    # Sheet header 5 value
    header5value = "12-05-2021"
    ws.write(4, 1, header5value, xlwt.easyxf("align: horiz left;align: horiz left;"))
    
    # Sheet header 6
    header6 = "ACADEMIC YEAR"
    ws.write(5, 0, header6, xlwt.easyxf("align: horiz left;align: horiz left;"))
    
    # Sheet header 6 value
    header6value = "2020/2021"
    ws.write(5, 1, header6value, xlwt.easyxf("align: horiz left;align: horiz left;"))
    
    # Sheet header 7
    header7 = "SUBJECT"
    ws.write(6, 0, header7, xlwt.easyxf("align: horiz left;align: horiz left;"))
    
    # Sheet header 7 value
    header7value = "CS 441 Wide Area Networks"
    ws.write(6, 1, header7value, xlwt.easyxf("align: horiz left;align: horiz left; font: bold on, underline on;"))
    
    # Sheet main body
    row_num = 8


    for col_num in range(len(newColumns)):
        ws.col(col_num).width = int(20*300) 
        # ws.write(row_num, col_num, (newColumns[col_num]), xlwt.easyxf("align: horiz center; font: name Calibri, bold on, height 280;"))
        ws.write(row_num, col_num, (newColumns[col_num]), xlwt.easyxf("align: horiz center; font: bold on, height 200;"))

    # Sheet body, remaining rows
    font_style = xlwt.XFStyle()


    
    
    # it works
    # ws.write(20, 2, xlwt.Formula("B1+B2"))
    
    for row in rows_to_display:
        row_num += 1
        for col_num in range(len(row)):
            ws.write(row_num, col_num, row[col_num], xlwt.easyxf("align: horiz center"))
        

    wb.save(response)
    return response