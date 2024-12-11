# Generated by Django 5.1.4 on 2024-12-11 21:13

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='UserModel',
            fields=[
                ('user_id', models.AutoField(primary_key=True, serialize=False)),
                ('username', models.CharField(max_length=50)),
                ('password', models.CharField(max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='Meeting',
            fields=[
                ('meeting_id', models.AutoField(primary_key=True, serialize=False)),
                ('meeting_name', models.CharField(max_length=50)),
                ('meeting_date', models.DateTimeField()),
                ('meeting_link', models.CharField(max_length=100)),
                ('meeting_user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='meetings_api.usermodel')),
            ],
        ),
    ]