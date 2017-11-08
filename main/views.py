import time
import json
import base64

from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.sites.shortcuts import get_current_site
from django.http import HttpResponse, JsonResponse
from django.template.loader import render_to_string
from django.core.mail import send_mail
from django.core.signing import Signer

from .models import Application
from .forms import EmailForm
from avocado import settings


def index(request):
    return render(request, 'main/applications.html')


def applications(request):
    if request.method == 'POST':
        body = request.body.decode('utf-8')
        data = json.loads(body)
        given_listing = Application.objects.get(id=data['listing_id'])
        Application.objects.create(user=request.user, listing=given_listing, stage='INITIAL')
        return HttpResponse(status=200)
    elif request.method == 'PATCH':
        body = request.body.decode('utf-8')
        data = json.loads(body)
        given_listing = Application.objects.get(id=data['listing_id'])
        new_stage = data['stage'].upper()
        Application.objects.filter(user=request.user, listing=given_listing).update(stage=new_stage)
        return HttpResponse(status=200)
    elif request.method == 'GET':  # for frontpage js
        application_listings_values_qs = Application.objects.filter(users__id=request.user.id).values_list('id')
        application_listings_values_list = list(application_listings_values_qs)
        application_listings_values = [listing_id for listings_tuple in application_listings_values_list for listing_id in listings_tuple]
        return JsonResponse({
            'applications': list(application_listings_values)
        })


@login_required
def applications_delete(request, listing_id):
    if request.method == 'POST':
        given_listing = Application.objects.get(id=listing_id)
        Application.objects.get(user=request.user, listing=given_listing).delete()
        return HttpResponse(status=200)
    else:
        return HttpResponse(status=405)


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
            messages.success(request, 'Login email sent! Please check your inbox and click on the link log in.')
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
        'Hi! This is your login link for Avocado Jobs',
        render_to_string('main/token_auth_email.txt', {'current_site': current_site, 'data': data}, request=request),
        settings.DEFAULT_FROM_EMAIL,
        [email],
    )


@login_required
def get_logout(request):
    logout(request)
    messages.success(request, 'You have been logged out.')
    return redirect(settings.LOGOUT_REDIRECT_URL)
