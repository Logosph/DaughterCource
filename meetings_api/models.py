from django.db import models

class UserModel(models.Model):
    user_id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=50)
    password = models.CharField()

class Meeting(models.Model):
    meeting_id = models.AutoField(primary_key=True)
    meeting_name = models.CharField(max_length=50)
    meeting_date = models.DateTimeField()
    meeting_link = models.CharField(max_length=100)
    meeting_user = models.ForeignKey(UserModel, on_delete=models.CASCADE)


