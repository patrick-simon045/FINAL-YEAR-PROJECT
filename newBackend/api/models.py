from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

import statistics


class Role(models.Model):
    role_name = models.CharField(max_length=20, null=False)

    def __str__(self):
        return self.role_name


class Lecturer(models.Model):
    lecturer = models.OneToOneField(
        User, on_delete=models.PROTECT, primary_key=True)
    # role_name = models.CharField(max_length=20, null=False, default='Lecturer')
    role = models.ForeignKey(Role, on_delete=models.PROTECT, null=True)

    def __str__(self):
        return str(self.lecturer)


@receiver(post_save, sender=User)
def add_lecturer_details_for_new_user(sender, instance=None, created=False, **kwargs):
    if created:
        lecturer = Lecturer(lecturer=instance)
        lecturer.save()


class Result(models.Model):
    name = models.CharField(default='question', max_length=10)
    first_question = models.IntegerField(default=5)
    second_question = models.IntegerField(default=6)
    third_question = models.IntegerField(default=7)
    fourth_question = models.IntegerField(default=8)

    def average_score(self):
        numbers = [
            int(self.first_question.value_to_string(self)),
            int(self.second_question.value_to_string(self)),
            int(self.third_question.value_to_string(self)),
            int(self.fourth_question.value_to_string(self)),
        ]
        average = statistics.mean(numbers)
        return average

    average = models.IntegerField(editable=False, default=average_score())

    def __str__(self):
        return self.name
