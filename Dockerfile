FROM python:3.13-slim

WORKDIR ./meetings_api

COPY . .

RUN pip install --upgrade pip
RUN pip install -r requirements.txt

EXPOSE 8001

CMD ["python", "manage.py", "runserver", "0.0.0.0:8001"]
