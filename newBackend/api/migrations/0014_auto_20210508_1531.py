# Generated by Django 3.0 on 2021-05-08 14:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0013_auto_20210508_1520'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='lecturer',
            name='lecturer',
        ),
        migrations.AddField(
            model_name='lecturer',
            name='role_name',
            field=models.CharField(default='Lecturer', max_length=20),
        ),
    ]