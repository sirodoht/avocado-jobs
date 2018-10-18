"""
Django settings for avocado project.

Generated by 'django-admin startproject' using Django 1.11.2.

For more information on this file, see
https://docs.djangoproject.com/en/1.11/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.11/ref/settings/
"""

import os

import dj_database_url

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.11/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv('AVOCADO_SECRET_KEY', 'secretwith50charssecretwith50charssecretwith50char')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True if os.getenv('NODEBUG') is None else False

ALLOWED_HOSTS = [
    'localhost',
    '127.0.0.1',
    'avocadojobs.com',
    'aws.avocadojobs.com',
]


# Application definition

INSTALLED_APPS = [
    'main.apps.MainConfig',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]

if not DEBUG:
    INSTALLED_APPS.append('raven.contrib.django.raven_compat')

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'avocado.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'avocado.wsgi.application'

LOGIN_URL = '/login'
LOGIN_REDIRECT_URL = '/?login=true'
LOGOUT_REDIRECT_URL = '/?logout=true'

AUTH_TOKEN_DURATION = 30 * 60  # in sec


# Database
# https://docs.djangoproject.com/en/1.11/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'avocado',
        'USER': 'avocado',
        'PASSWORD': 'avocado',
        'HOST': '127.0.0.1',
        'PORT': '5432',
    }
}

# Update database configuration with $DATABASE_URL.
# https://devcenter.heroku.com/articles/django-app-configuration#database-configuration
db_from_env = dj_database_url.config(conn_max_age=500)
DATABASES['default'].update(db_from_env)


# Password hashing
# https://docs.djangoproject.com/en/1.11/topics/auth/passwords/#how-django-stores-passwords

PASSWORD_HASHERS = [
    'django.contrib.auth.hashers.Argon2PasswordHasher',
    'django.contrib.auth.hashers.PBKDF2PasswordHasher',
    'django.contrib.auth.hashers.PBKDF2SHA1PasswordHasher',
    'django.contrib.auth.hashers.BCryptSHA256PasswordHasher',
    'django.contrib.auth.hashers.BCryptPasswordHasher',
]


# Password validation
# https://docs.djangoproject.com/en/1.11/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/1.11/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = False

USE_L10N = False

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.11/howto/static-files/

PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))

STATIC_ROOT = os.path.join(PROJECT_ROOT, 'staticfiles')

if DEBUG:
    STATIC_URL = '/staticfiles/'
else:
    STATIC_URL = 'https://assets.avocadojobs.com/'


# Email
# https://docs.djangoproject.com/en/1.11/topics/email/

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_USE_TLS = True
EMAIL_HOST = 'email-smtp.us-west-2.amazonaws.com'
EMAIL_HOST_USER = os.getenv('AVOCADO_EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = os.getenv('AVOCADO_EMAIL_HOST_PASSWORD')
EMAIL_PORT = 587

DEFAULT_FROM_EMAIL = 'hi@avocadojobs.com'
EMAIL_ALERT = 'theodorekeloglou@gmail.com'


# Authentication backends
# https://docs.djangoproject.com/en/1.11/topics/auth/customizing/

AUTHENTICATION_BACKENDS = (
    'main.auth_backends.EmailTokenBackend',
    'django.contrib.auth.backends.ModelBackend',
)


# The age of session cookies, in seconds
# https://docs.djangoproject.com/en/2.0/topics/http/sessions/

SESSION_COOKIE_AGE = 31449600  # 60 * 60 * 24 * 7 * 52 = 1 year in seconds


# Security middleware
# https://docs.djangoproject.com/en/1.11/ref/middleware/#module-django.middleware.security

if not DEBUG:
    SECURE_CONTENT_TYPE_NOSNIFF = True
    SECURE_BROWSER_XSS_FILTER = True
    X_FRAME_OPTIONS = 'DENY'
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_SSL_REDIRECT = True


# Sentry
# https://docs.sentry.io/clients/python/integrations/django/

RAVEN_CONFIG = {
    'dsn': os.getenv('AVOCADO_SENTRY_DSN'),
}
