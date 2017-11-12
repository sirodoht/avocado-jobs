import time
import json
import base64
import datetime

from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.sites.shortcuts import get_current_site
from django.http import JsonResponse
from django.template.loader import render_to_string
from django.core.mail import send_mail
from django.core.signing import Signer

from .models import Application
from .forms import EmailForm
from avocado import settings


def index(request):
    today = datetime.datetime.now()
    applications_list = []
    if (request.user.is_authenticated):
        applications_list = Application.objects.filter(user=request.user).order_by('-id')
    return render(request, 'main/applications.html', {
        'today': today,
        'applications_list': applications_list,
    })


@login_required
def applications(request):
    if request.method == 'POST':
        body = request.body.decode('utf-8')
        data = json.loads(body)
        Application.objects.create(
            user=request.user,
            role=data['role'],
            company=data['company'],
            salary=data['salary'],
            date_applied=data['date'],
            link=data['link'],
            stage=data['stage'],
        )
        return JsonResponse({})
    elif request.method == 'PATCH':
        body = request.body.decode('utf-8')
        data = json.loads(body)
        newValues = {}
        if 'salary' in data:
            newValues['salary'] = data['salary']
        if 'stage' in data:
            newValues['stage'] = data['stage'].lower()
        applicationId = int(data['id'])

        if Application.objects.get(id=applicationId).user != request.user:
            return JsonResponse(status=401, data={
                'status': 'false',
                'message': 'Unauthorized',
            })

        Application.objects.filter(user=request.user, id=applicationId).update(**newValues)
        return JsonResponse({})


@login_required
def applications_delete(request, application_id):
    if request.method == 'DELETE':
        application = Application.objects.get(id=application_id)
        if application.user != request.user:
            return JsonResponse(status=401, data={
                'status': 'false',
                'message': 'Unauthorized',
            })
        else:
            application.delete()
            return JsonResponse({})


def get_login(request):
    return render(request, 'main/login.html', {
        'next': request.GET.get('next'),
    })


def token_post(request):
    if request.user.is_authenticated():
        messages.error(request, 'You are already logged in.')
        return redirect(settings.LOGIN_REDIRECT_URL)

    if request.GET.get('d'):
        # The user has clicked a login link.
        user = authenticate(token=request.GET['d'])
        if user is not None:
            login(request, user)
            messages.success(request, 'Login successful.')
            return redirect(settings.LOGIN_REDIRECT_URL)
        else:
            messages.error(request, 'The login link was invalid or has expired. Please try to log in again.')
    elif request.method == 'POST':
        # The user has submitted the email form.
        form = EmailForm(request.POST)
        if form.is_valid():
            email_login_link(request, form.cleaned_data['email'])
            messages.success(request, 'Login email sent! Please check your inbox and click on the login link.')
        else:
            messages.error(request, 'The email address was invalid. Please check the address and try again.')
    else:
        messages.error(request, 'The login link was invalid or has expired. Please try to log in again.')

    return redirect(settings.LOGIN_URL)


def email_login_link(request, email):
    current_site = get_current_site(request)

    # Create the signed structure containing the time and email address.
    email = email.lower().strip()
    data = {
        't': int(time.time()),
        'e': email,
    }
    data = Signer().sign(base64.b64encode(json.dumps(data).encode('utf8')))

    # Send the link by email.
    send_mail(
        'Login link for Avocado Jobs',
        render_to_string('main/token_auth_email.txt', {'current_site': current_site, 'data': data}, request=request),
        settings.DEFAULT_FROM_EMAIL,
        [email],
    )


@login_required
def get_logout(request):
    logout(request)
    messages.success(request, 'You have been logged out.')
    return redirect(settings.LOGOUT_REDIRECT_URL)
