# Generated by Django 3.0 on 2021-05-26 09:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backendapi', '0029_auto_20210526_1012'),
    ]

    operations = [
        migrations.AlterField(
            model_name='assessment',
            name='academic_year',
            field=models.CharField(choices=[('a', '2020/2021'), ('b', '2021/2022'), ('c', '2022/2023'), ('d', '2023/2024'), ('e', '2024/2025'), ('f', '2025/2026'), ('g', '2026/2027'), ('h', '2027/2028'), ('i', '2028/2029'), ('j', '2029/2030'), ('k', '2030/2031'), ('l', '2031/2032')], default='a', max_length=9),
        ),
    ]
