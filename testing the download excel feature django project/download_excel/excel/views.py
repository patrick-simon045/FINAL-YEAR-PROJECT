import xlwt
from django.http import HttpResponse
from django.template import loader
from django.contrib.auth.models import User

# from django.shortcuts import render

from django.views.generic.base import TemplateView


class ExcelPageView(TemplateView):
    template_name = "excel_home.html"


def export_users_xls(request):
    response = HttpResponse(content_type='application/ms-excel')
    response['Content-Disposition'] = 'attachment; filename="users.xls"'

    wb = xlwt.Workbook(encoding='utf-8')
    ws = wb.add_sheet('Users Data')  # this will make a sheet named Users Data

    # writing the first row
    alignment = xlwt.Alignment()
    alignment.horz = xlwt.Alignment.HORZ_CENTER
    look = xlwt.Font()
    look.bold = True
    horz_style = xlwt.XFStyle()
    horz_style.alignment = alignment
    horz_style.font = look

    top_row = 1
    bottom_row = 1
    left_column = 0
    right_column = 3
    ws.write_merge(top_row, bottom_row, left_column, right_column, 'UNIVERSITY OF DAR ES SALAAM', horz_style)
    # end of first row

    # writing the second row
    alignment = xlwt.Alignment()
    alignment.horz = xlwt.Alignment.HORZ_CENTER
    look = xlwt.Font()
    look.bold = False
    horz_style = xlwt.XFStyle()
    horz_style.alignment = alignment
    horz_style.font = look

    top_row = 3
    bottom_row = 3
    left_column = 0
    right_column = 3
    ws.write_merge(top_row, bottom_row, left_column, right_column, 'SUMMARY OF RESULTS (PAPERS/COURSES/PRACTICAL/ORAL)',
                   horz_style)
    # end of second row

    # writing programme
    row_num = 5
    col_num = 0
    ws.write(row_num, col_num, "CEIT", xlwt.XFStyle())
    # end of writing programme

    # writing year of study
    row_num = 5
    col_num = 2
    ws.write(row_num, col_num, "YEAR OF STUDY", xlwt.XFStyle())
    # end of writing year of study
    #
    # writing year of study value
    row_num = 5
    col_num = 3
    style = xlwt.XFStyle()
    bold_style = xlwt.Font()
    bold_style.bold = True
    style.font = bold_style
    style.alignment = alignment
    ws.write(row_num, col_num, "III", style)
    # end of writing year of study value

    # Sheet header, first row
    row_num = 10

    font_style = xlwt.XFStyle()
    font_style.font.bold = True

    columns = ['Username', 'First Name', 'Last Name', 'Email Address', ]

    for col_num in range(len(columns)):
        cwidth = ws.col(col_num).width
        if (len(columns[col_num]) * 367) > cwidth:
            ws.col(col_num).width = (len(columns[col_num]) * 367)
        ws.write(row_num, col_num, columns[col_num], font_style)  # at 0 row 0 column

    # Sheet body, remaining rows
    font_style = xlwt.XFStyle()

    rows = User.objects.all().values_list('username', 'first_name', 'last_name', 'email')
    for row in rows:
        row_num += 1
        for col_num in range(len(row)):
            ws.write(row_num, col_num, row[col_num], font_style)

    wb.save(response)

    return response


def download_excel_data(request):
    response = HttpResponse(content_type='application/ms-excel')
    response['Content-Disposition'] = 'attachment; filename="users.xls"'
    template = loader.get_template('excel_home.html')

    wb = xlwt.Workbook(encoding='utf-8')
    ws = wb.add_sheet('Users')

    # Sheet header, first row
    row_num = 0

    font_style = xlwt.XFStyle()
    font_style.font.bold = True

    columns = ['Username', 'First name', 'Last name', 'Email address', ]

    for col_num in range(len(columns)):
        ws.write(row_num, col_num, columns[col_num], font_style)

    # Sheet body, remaining rows
    font_style = xlwt.XFStyle()

    rows = User.objects.all().values_list(
        'username', 'first_name', 'last_name', 'email')
    for row in rows:
        row_num += 1
        for col_num in range(len(row)):
            ws.write(row_num, col_num, row[col_num], font_style)

    wb.save(response)
    return HttpResponse(template.render(request))
