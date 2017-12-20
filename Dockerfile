FROM python:latest
ENV PYTHONUNBUFFERED 1
RUN apt-get update

RUN apt-get install -y swig libssl-dev dpkg-dev netcat
RUN pip install -U pip
ADD requirements.txt /code/
RUN pip install -Ur /code/requirements.txt

# Add the Dokku-specific files to their locations.
ADD misc/dokku/CHECKS /app/
ADD misc/dokku/* /code/

WORKDIR /code
COPY . /code/
