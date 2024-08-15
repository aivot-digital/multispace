# Build frontend

FROM node:18-alpine AS frontend

WORKDIR /build

COPY app/package.json package.json
COPY app/package-lock.json package-lock.json

RUN npm ci

COPY app/tsconfig.json tsconfig.json
COPY app/public public
COPY app/src src

RUN npm run build


FROM python:3.9.6-alpine AS run

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV MULTISPACE_PROD 1

WORKDIR /app

RUN apk update && \
    apk add \
      postgresql-dev  \
      gcc  \
      python3-dev  \
      musl-dev  \
      jpeg-dev  \
      zlib-dev

RUN pip install --upgrade pip
RUN pip install gunicorn

COPY ./requirements.txt .
RUN pip install -r requirements.txt && rm requirements.txt

COPY api api
COPY core core
COPY multispace multispace
COPY manage.py manage.py

RUN python manage.py collectstatic --no-input

COPY --from=frontend /build/build/index.html web/index.html
COPY --from=frontend /build/build/favicon.ico web/favicon.ico
COPY --from=frontend /build/build/static static

CMD gunicorn \
    --bind unix:/app/run/gunicorn.sock \
    --workers 3 \
    multispace.wsgi:application
