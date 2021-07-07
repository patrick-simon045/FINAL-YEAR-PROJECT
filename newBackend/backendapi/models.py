from django.db import models
from django.conf import settings
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.validators import MinValueValidator, MaxValueValidator
from django.urls import reverse
from rest_framework.authtoken.models import Token


class Role(models.Model):
    role_name = models.CharField(max_length=20, null=False)

    def __str__(self):
        return self.role_name


class Course(models.Model):

    CREDITS = (
        ("12", 12), ("8", 8)
    )

    course_code = models.CharField(max_length=50, primary_key=True)
    course_name = models.CharField(max_length=50)
    program = models.ManyToManyField("Program", through='Program_Course')
    credits = models.IntegerField(default=12, validators=[
                                  MaxValueValidator(16), MinValueValidator(8)])

    def __str__(self):
        return self.course_code

    class Meta:
        verbose_name = "course"
        verbose_name_plural = "courses"

    def get_absolute_url(self):
        return reverse("course_detail", kwargs={"pk": self.pk})


class CA_Item(models.Model):
    ca_item_name = models.CharField(max_length=20, primary_key=True)

    def __str__(self):
        return self.ca_item_name


class Lecturer(models.Model):
    lecturer = models.OneToOneField(
        User, on_delete=models.PROTECT, primary_key=True)
    # role_name = models.CharField(max_length=20, null=False, default='Lecturer')
    role = models.ForeignKey(Role, on_delete=models.PROTECT, null=True)
    course = models.ManyToManyField(Course, through='Lecture_Course')

    # criteria = models.ManyToManyField(CA_Item, through='LecturerCriteria')

    def __str__(self):
        return str(self.lecturer)

    class Meta:
        verbose_name = "lecturer"
        verbose_name_plural = "lecturers"
        unique_together = ['lecturer', 'role']

    def get_absolute_url(self):
        return reverse("lecturer_detail", kwargs={"pk": self.pk})


@receiver(post_save, sender=User)
def add_lecturer_details_for_new_user(sender, instance=None, created=False, **kwargs):
    if created:
        lecturer = Lecturer(lecturer=instance)
        lecturer.save()


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)


class Program(models.Model):
    program_name = models.CharField(max_length=50, primary_key=True)
    program_span = models.IntegerField(validators=[
        MaxValueValidator(4),
        MinValueValidator(1),
    ])

    def __str__(self):
        return self.program_name


class Program_Course(models.Model):
    ACADEMIC_YEAR = (
        ('a', '2020/2021'),
        ('b', '2021/2022'),
        ('c', '2022/2023'),
        ('d', '2023/2024'),
        ('e', '2024/2025'),
        ('f', '2025/2026'),
    )

    COURSE_TYPE = (
        ('core', 'Core'), ('optional', 'Optional')
    )

    YEARS_OF_STUDY = (
        ('1', '1'), ('2', '2'), ('3', '3'), ('4', '4'), ('5', '5')
    )

    course = models.ForeignKey(
        'Course', on_delete=models.CASCADE)
    program = models.ForeignKey(
        'Program', on_delete=models.CASCADE)
    semester = models.IntegerField(validators=[
        MaxValueValidator(2),
        MinValueValidator(1),
    ], default=1)
    course_type = models.CharField(
        max_length=10, choices=COURSE_TYPE, default='core', null=True)
    year_of_study = models.CharField(
        max_length=1, choices=YEARS_OF_STUDY, default='1')
    academic_year = models.CharField(
        max_length=9, choices=ACADEMIC_YEAR, default='a')

    def __str__(self):
        return "programme: {} -> course: {}".format(self.program, self.course)

    class Meta:
        unique_together = ['course', 'program', 'academic_year',
                           'semester', 'course_type', 'year_of_study']


class Lecture_Course(models.Model):
    ACADEMIC_YEAR = (
        ('a', '2020/2021'),
        ('b', '2021/2022'),
        ('c', '2022/2023'),
        ('d', '2023/2024'),
        ('e', '2024/2025'),
        ('f', '2025/2026'),
    )

    lecturer = models.ForeignKey(
        'Lecturer', on_delete=models.CASCADE)
    course = models.ForeignKey(
        'Course', on_delete=models.CASCADE)
    # assessmentCriteria = models.ForeignKey(
    #     'CA_Item', on_delete=models.CASCADE, null=True)
    # ca_contribution = models.IntegerField(validators=[
    #     MaxValueValidator(40),
    #     MinValueValidator(0),
    # ], default=20)
    academic_year = models.CharField(
        max_length=9, choices=ACADEMIC_YEAR, default='a')

    def __str__(self):
        return '{} {}'.format(self.lecturer, self.course)

    class Meta:
        unique_together = ['lecturer', 'course', 'academic_year']


class Student(models.Model):
    first_name = models.CharField(max_length=50)
    middle_name = models.CharField(max_length=50, blank=True, null=True)
    last_name = models.CharField(max_length=50)
    regno = models.CharField(max_length=13, primary_key=True)
    program = models.ForeignKey(
        'Program', related_name='program', on_delete=models.SET('empty'))

    class Meta:
        verbose_name = "student"
        verbose_name_plural = "students"

    def __str__(self):
        return self.regno

    def get_absolute_url(self):
        return reverse("student_detail", kwargs={"pk": self.pk})


class Assessment(models.Model):
    ACADEMIC_YEAR = (
        ('2020/2021', '2020/2021'),
        ('2021/2022', '2021/2022'),
        ('2022/2023', '2022/2023'),
        ('2023/2024', '2023/2024'),
        ('2024/2025', '2024/2025'),
        ('2025/2026', '2025/2026'),
    )

    criteria = models.ForeignKey(
        'CA_Item', related_name='assessment', on_delete=models.CASCADE)
    course = models.ForeignKey(
        'Course', related_name='assessment', on_delete=models.CASCADE)
    academic_year = models.CharField(
        max_length=9, choices=ACADEMIC_YEAR, default='2020/2021', null=True)
    # time = models.CharField(max_length=8, choices=TIME, default='a')
    # date_taken = models.DateField(verbose_name='Date', auto_now_add=False)
    date_taken = models.CharField(
        verbose_name='Date', max_length=10, null=True)
    # total_mark = models.IntegerField(default=20, verbose_name='Total marks',
    #                                  validators=[MaxValueValidator(100), MinValueValidator(0)])
    number_of_questions = models.IntegerField(
        validators=[MinValueValidator(1)], default=4)
    contribution = models.IntegerField(default=20, verbose_name='Contribution to CA in Percentage',
                                       validators=[MaxValueValidator(40), MinValueValidator(0)])

    def __str__(self):
        return "{} {}".format(self.course, self.criteria)

    class Meta:
        unique_together = ['course', 'criteria']


@receiver(post_save, sender=Assessment)
def create_results_table(sender, created=False, **kwargs):
    if created:
        print("here we go")
        course = kwargs.get('instance').course
        programs = Program_Course.objects.filter(course=course)
        for program in programs:
            students = Student.objects.filter(program=program.program)
            for student in students:
                semester = program.semester
                course_type = program.get_course_type_display()
                year_of_study = program.get_year_of_study_display()
                academic_year = program.get_academic_year_display()

                print("student: {} course: {} programme: {} semester: {} course type: {} year of study: {} academic year: {}".format(
                    student, course, program, semester, course_type, year_of_study, academic_year))

                a = Assessment_Results.objects.create(
                    assessment=kwargs.get('instance'), student=student, semester=semester, course_type=course_type, year_of_study=year_of_study, academic_year=academic_year)
                print(a)


class Assessment_Results(models.Model):
    # ACADEMIC_YEAR = (
    #     ('a', '2020/2021'),
    #     ('b', '2021/2022'),
    #     ('c', '2022/2023'),
    #     ('d', '2023/2024'),
    #     ('e', '2024/2025'),
    #     ('f', '2025/2026'),
    # )

    assessment = models.ForeignKey(
        'Assessment', related_name='result', on_delete=models.CASCADE)
    student = models.ForeignKey(
        'Student', related_name='assessment_result', on_delete=models.CASCADE)
    score = models.IntegerField(
        validators=[MaxValueValidator(100), MinValueValidator(0)], default=0)
    semester = models.IntegerField(validators=[
        MaxValueValidator(2),
        MinValueValidator(1),
    ], default=1)
    course_type = models.CharField(
        max_length=10, default='core', null=True)
    year_of_study = models.CharField(
        max_length=1, null=True)
    academic_year = models.CharField(
        max_length=9, null=True)

    # academic_year = models.CharField(max_length=9, choices=ACADEMIC_YEAR, default='a')

    def __str__(self):
        return "{} {}".format(self.student, self.assessment)

    # def save(self, *args, **kwargs):
    #     created = not self.pk
    #     if created:
    #         CA.objects.update_or_create(student=self.student, course=self.assessment.course,
    #                                     academic_year=self.assessment.academic_year)
    #     super().save(*args, **kwargs)

        # def save(self, *args, **kwargs):
        #     try:
        #         voucher_type = VoucherTypeMaster.objects.get(
        #             company=self.company,
        #             code=self.type.code
        #         )
        #         if self.id is None:
        #             voucher_type.last_number = voucher_type.last_number + 1
        #             self.type = voucher_type
        #             voucher_type.save()
        #     except Exception, e:
        #         print
        #         e
        #     super(Voucher, self).save(*args, **kwargs)

        # student = models.ForeignKey('Student', on_delete=models.CASCADE)
        # course = models.ForeignKey('Course', on_delete=models.CASCADE)
        # ca = models.IntegerField(null=True)
        # academic_year = models.CharField(max_length=9, choices=ACADEMIC_YEAR, default='a')

    class Meta:
        unique_together = ['assessment', 'student', 'score']


class UE(models.Model):
    exam_type = models.CharField(max_length=30)
    course = models.ForeignKey(
        'Course', related_name='ue', on_delete=models.CASCADE)
    academic_year = models.CharField(max_length=5)
    date_taken = models.DateTimeField(verbose_name='Date', auto_now_add=True)
    total_mark = models.IntegerField(verbose_name='Total marks',
                                     validators=[MaxValueValidator(100), MinValueValidator(0)])
    number_of_questions = models.IntegerField(
        validators=[MinValueValidator(1)])

    def __str__(self):
        return f'{self.criteria} {self.academic_year}'

    def __str__(self):
        return

    def __unicode__(self):
        return

    class Meta:
        unique_together = ['course', 'exam_type', 'academic_year',
                           'date_taken', 'total_mark', 'number_of_questions']


class UE_Results(models.Model):
    score = models.IntegerField(validators=[MaxValueValidator(100)])
    total_score = models.IntegerField(validators=[MaxValueValidator(100)])
    question_number = models.IntegerField(validators=[MinValueValidator(1)])
    student = models.ForeignKey(
        'Student', related_name='result', on_delete=models.CASCADE)
    ue = models.ForeignKey(
        'UE', related_name='result', on_delete=models.CASCADE)

    def __str__(self):
        return

    def __unicode__(self):
        return

    class Meta:
        unique_together = ['score', 'total_score',
                           'question_number', 'student', 'ue']


class Result(models.Model):
    name = models.CharField(default='question', max_length=10)
    first_question = models.PositiveSmallIntegerField(validators=[
        MaxValueValidator(10),
        MinValueValidator(0),
    ])
    second_question = models.PositiveSmallIntegerField(validators=[
        MaxValueValidator(10),
        MinValueValidator(0),
    ])
    third_question = models.PositiveSmallIntegerField(
        validators=[
            MaxValueValidator(10),
            MinValueValidator(0),
        ]
    )
    fourth_question = models.PositiveSmallIntegerField(validators=[
        MaxValueValidator(10),
        MinValueValidator(0),
    ])

    sum = models.PositiveSmallIntegerField(null=True)

    def save(self, *args, **kwargs):
        self.sum = self.first_question + self.second_question + \
            self.third_question + self.fourth_question
        super(Result, self).save(*args, **kwargs)

    def __str__(self):
        return self.name


# class LecturerCriteria(models.Model):
#     lecturer = models.ForeignKey(
#         'Lecturer', related_name='lecturer_criteria', on_delete=models.CASCADE)
#     assessmentCriteria = models.ForeignKey(
#         'CA_Item', related_name='criteria', on_delete=models.CASCADE)
#     ca_contribution = models.IntegerField(validators=[
#         MaxValueValidator(40),
#         MinValueValidator(0),
#     ], default=20)
#
#     class Meta:
#         unique_together = ['lecturer', 'assessmentCriteria']


class CA(models.Model):
    ACADEMIC_YEAR = (
        ('a', '2020/2021'),
        ('b', '2021/2022'),
        ('c', '2022/2023'),
        ('d', '2023/2024'),
        ('e', '2024/2025'),
        ('f', '2025/2026'),
    )

    student = models.ForeignKey('Student', on_delete=models.CASCADE)
    course = models.ForeignKey('Course', on_delete=models.CASCADE)
    year_of_study = models.IntegerField(null=True, default=1)
    semester = models.IntegerField(null=True, default=1)
    academic_year = models.CharField(
        max_length=9, default='2020/2021')
    ca = models.IntegerField(null=True, default=0)

    def __str__(self):
        return f'{self.student} {self.ca}'

# @receiver(post_save, sender=Assessment_Results)
# def add_ca_record_for_a_student(sender, instance=None, created=False, **kwargs):
#     if created:
#         CA.objects.update_or_create(student=instance.student, course=instance.assessment.course,
#                                     academic_year=instance.assessment.academic_year)
#
#         # lecturer = Lecturer(lecturer=instance)
#         # lecturer.save()

class CourseWorkAssessment(models.Model):
    student = models.ForeignKey('Student', on_delete=models.CASCADE)
    course = models.ForeignKey('Course', on_delete=models.CASCADE)
    year_of_study = models.IntegerField(null=True, default=1)
    semester = models.IntegerField(null=True, default=1)
    academic_year = models.CharField(
        max_length=9, default='2020/2021')
    ca = models.IntegerField(null=True, default=0)

    def __str__(self):
        return "{} {}".format(self.student, self.course)

    # class Meta:
    #     unique_together = ['student', 'course', 'year_of_study', 'semester', 'academic_year']

# OPTION 1: CA is created when the lecturer requests for a CA report
# 1. find the list of courses for a particular lecture
# 2. loop through the AssessmentResults Table where the Assessment has a course in the list of courses for a particular lecturer
# 3. for each course in (1), loop through the Assessment table to have a list of assessment criteria assigned to that course
# 4. for each course in (1), get the list of students studying that particular course
# 5. for each student in (4), loop through the list in (2) for each course and for each assessment in (3), add the scores so as to get the Course Work Assessment
