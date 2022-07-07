FROM python:3.9.6-alpine

ARG VERSION

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV MULTISPACE_PROD 1
ENV MULTISPACE_VERSION $VERSION

RUN apk update && \
    apk add \
      nginx \
      postgresql-dev  \
      gcc  \
      python3-dev  \
      musl-dev  \
      jpeg-dev  \
      zlib-dev

RUN adduser --no-create-home --disabled-password --ingroup www-data www-data

COPY ./nginx.conf /etc/nginx/http.d/default.conf
RUN nginx -t

RUN pip install --upgrade pip
RUN pip install gunicorn

WORKDIR /app

COPY ./requirements.txt .
RUN pip install -r requirements.txt

COPY . .

RUN python manage.py collectstatic --no-input

RUN chown -R www-data:www-data /app
RUN chmod +x /app/entrypoint.sh

CMD /app/entrypoint.sh
STOPSIGNAL SIGTERM
