#!/bin/sh

python manage.py migrate

if [ -n "$DJANGO_SUPERUSER_USERNAME" ] && [ -n "$DJANGO_SUPERUSER_PASSWORD" ] ; then
    python manage.py createsuperuser --no-input
fi

gunicorn multispace.wsgi --bind 127.0.0.1:8000 --workers 3 & nginx -g "daemon off;"
