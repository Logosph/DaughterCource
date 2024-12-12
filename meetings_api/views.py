import hashlib
from datetime import datetime, UTC, timedelta

import jwt
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST

from MeetingsServer import settings
from meetings_api import models


@require_POST
@csrf_exempt
def login(request):
    try:
        auth_header = request.META.get("HTTP_AUTHORIZATION")
        if auth_header:
            auth_type, auth_token = auth_header.split(" ")
            if auth_type == "Bearer":
                decoded_jwt = jwt.decode(auth_token, settings.SECRET_KEY, algorithms=['HS256'])
                user_id = decoded_jwt.get("user_id")
                user = models.UserModel.objects.filter(user_id=user_id).first()
                if user is not None:
                    return JsonResponse({"jwt_token": generate_jwt_token(user_id)}, status=200)
                else:
                    return JsonResponse({"error": "User not found"}, status=401)
    except jwt.ExpiredSignatureError:
        return JsonResponse({"error": "Token expired"}, status=401)
    except jwt.InvalidTokenError:
        return JsonResponse({"error": "Invalid token"}, status=401)

    username = request.POST.get("username")
    password = request.POST.get("password")
    hashed_password = hashlib.sha256(password.encode(), usedforsecurity=True).hexdigest()

    user = models.UserModel.objects.filter(username=username, password=hashed_password).first()
    if user is not None:
        token = generate_jwt_token(user.user_id)
        return JsonResponse({"jwt_token": token}, status=200)
    else:
        return JsonResponse({"error": "Wrong username or password"}, status=401)


@require_POST
@csrf_exempt
def signup(request):
    username = request.POST.get("username")
    password = request.POST.get("password")
    user = models.UserModel.objects.filter(username=username).first()
    if user is not None:
        return JsonResponse({"error": "User already exists"}, status=400)
    hashed_password = hashlib.sha256(password.encode(), usedforsecurity=True).hexdigest()
    user = models.UserModel.objects.create(username=username, password=hashed_password)
    return JsonResponse({"jwt_token": generate_jwt_token(user.user_id)}, status=201)


def get_meetings(request):
    meetings = models.Meeting.objects.all()
    resp = {"meetings": []}
    for meeting in meetings:
        resp["meetings"].append({
            "name": meeting.meeting_name,
            "date": meeting.meeting_date,
            "time": meeting.meeting_time,
            "duration": meeting.meeting_duration_in_minutes,
            "link": meeting.meeting_link,
            "capacity": meeting.meeting_count_of_users,
        })
    return JsonResponse(resp, status=200)


@require_POST
@csrf_exempt
def add_meeting(request):
    name = request.POST.get("name")
    date = request.POST.get("date")
    time = request.POST.get("time")
    link = request.POST.get("link")
    duration = request.POST.get("duration")
    capacity = request.POST.get("capacity")

    models.Meeting.objects.create(
        meeting_name=name,
        meeting_date=date,
        meeting_link=link,
        meeting_user_id=1,
        meeting_duration_in_minutes=duration,
        meeting_count_of_users=capacity,
        meeting_time=time
    )
    return JsonResponse({"message": "Meeting created"}, status=201)


def generate_jwt_token(user_id):
    payload = {
        "user_id": user_id,
        "exp": datetime.now(UTC) + timedelta(minutes=15)
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
