from datetime import datetime

from django.db import models

class UserModel(models.Model):
    user_id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=50)
    password = models.CharField(max_length=1000)

class Meeting(models.Model):
    meeting_id = models.AutoField(primary_key=True)
    meeting_name = models.CharField(max_length=50)
    meeting_date = models.DateField(default="2021-01-01")
    meeting_time = models.TimeField(default="00:00:00")
    meeting_link = models.CharField(max_length=100)
    meeting_duration_in_minutes = models.IntegerField(default=30)
    meeting_count_of_users = models.IntegerField(default=15)
    meeting_user = models.ForeignKey(UserModel, on_delete=models.CASCADE)


