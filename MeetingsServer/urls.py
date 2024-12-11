from django.urls import path

from meetings_api.views import *

urlpatterns = [
    path("login", login),
    path("signup", signup),
    path("get_meetings", get_meetings),
    path("add_meeting", add_meeting),
]
