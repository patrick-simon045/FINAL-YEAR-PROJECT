# Generated by Django 3.0 on 2021-05-24 00:13

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('backendapi', '0021_auto_20210524_0110'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='lecture_course',
            name='assessmentCriteria',
        ),
    ]
