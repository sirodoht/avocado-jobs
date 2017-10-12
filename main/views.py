import os, time, json, base64

import analytics

from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.sites.shortcuts import get_current_site
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.urls import reverse
from django.forms import model_to_dict
from django.template.loader import render_to_string
from django.core.mail import send_mail
from django.core.signing import Signer

from .models import Listing, Category, Tag, Application
from .forms import ListingForm, EmailForm
from avocado import settings


def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


def index(request):
    categories = Category.objects.order_by('id')
    analytics.page(get_client_ip(request), 'No Auth', 'Index', {
        'url': request.get_full_path(),
    })
    return render(request, 'main/index.html', {
        'categories': categories,
    })


def listing_detail(request, listing_id):
    listing = Listing.objects.get(id=listing_id)
    analytics.page(get_client_ip(request), 'No Auth', 'Listing Detail', {
        'url': request.get_full_path(),
    })
    return render(request, 'main/detail.html', {
        'listing': listing,
    })


@login_required
def listing_delete(request, listing_id):
    if request.method == 'POST':
        listing = Listing.objects.get(id=listing_id)
        listing.delete()
        return HttpResponseRedirect(reverse('main:listings'))
    else:
        return HttpResponse(status=404)


def report(request, listing_id):
    return HttpResponse("You're looking at the report of listing %s." % listing_id)


@login_required
def listings(request):
    listings_list = Listing.objects.filter(owner=request.user)
    analytics.page(request.user.id, 'Applications', {
        'url': request.get_full_path(),
        'ip': get_client_ip(request),
    })
    return render(request, 'main/my_listings.html', {
        'listings_list': listings_list,
    })


@login_required
def applications(request):
    if request.method == 'POST':
        body = request.body.decode('utf-8')
        data = json.loads(body)
        given_listing = Listing.objects.get(id=data['listing_id'])
        Application.objects.create(user=request.user, listing=given_listing, stage='INITIAL')
        analytics.track(request.user.id, 'Add listing to applications', {
            'id': given_listing.id,
            'role': given_listing.role_title,
            'ip': get_client_ip(request),
        })
        return HttpResponse(status=200)
    elif request.method == 'PATCH':
        body = request.body.decode('utf-8')
        data = json.loads(body)
        given_listing = Listing.objects.get(id=data['listing_id'])
        new_stage = data['stage'].upper()
        Application.objects.filter(user=request.user, listing=given_listing).update(stage=new_stage)
        return HttpResponse(status=200)
    else:
        if request.content_type == 'application/json':  # for frontpage js
            application_listings_values_qs = Listing.objects.filter(users__id=request.user.id).values_list('id')
            application_listings_values_list = list(application_listings_values_qs)
            application_listings_values = [listing_id for listings_tuple in application_listings_values_list for listing_id in listings_tuple]
            return JsonResponse({
                'applications': list(application_listings_values)
            })
        else:
            applications_list = Application.objects.filter(user=request.user)
            analytics.page('why', 'Applications', {
                'url': request.get_full_path(),
                'ip': get_client_ip(request),
            })
            return render(request, 'main/applications.html', {
                'applications_list': applications_list,
            })


@login_required
def applications_delete(request, listing_id):
    if request.method == 'POST':
        given_listing = Listing.objects.get(id=listing_id)
        Application.objects.get(user=request.user, listing=given_listing).delete()
        return HttpResponse(status=200)
    else:
        return HttpResponse(status=405)


@login_required
def create(request):
    if request.method == 'POST':
        form = ListingForm(request.POST)
        if form.is_valid():
            saved_listing = form.save(commit=False)
            saved_listing.owner = request.user
            saved_listing.save()
            if form.cleaned_data['tags'].strip():
                tags = form.cleaned_data['tags'].split(',')
                for single_tag in tags[:3]:
                    stripped_tag = single_tag.strip()
                    Tag.objects.create(tag_name=stripped_tag, listing=saved_listing)
            return HttpResponseRedirect(reverse('main:create_preview', kwargs={'listing_id': saved_listing.id}))
        else:
            return HttpResponse('Listing edit form of %s is invalid.' % listing_id)
    else:
        form = ListingForm()
        return render(request, 'main/create.html', {
            'form': form
        })


@login_required
def create_preview(request, listing_id):
    listing = Listing.objects.get(id=listing_id)
    analytics.track(request.user.id, 'Listing preview', {
        'id': saved_listing.id,
        'role': saved_listing.role_title,
        'ip': get_client_ip(request),
    })
    return render(request, 'main/preview.html', {
        'listing': listing
    })


@login_required
def create_thank(request, listing_id):
    Listing.objects.filter(id=listing_id).update(confirmed=True)
    analytics.track(request.user.id, 'Listing confirmed', {
        'id': saved_listing.id,
        'role': saved_listing.role_title,
        'ip': get_client_ip(request),
    })
    return render(request, 'main/thank-you.html', {
        'listing_id': listing_id
    })


@login_required
def listing_edit(request, listing_id):
    if request.method == 'POST':
        listing_instance = Listing.objects.get(id=listing_id)
        if listing_instance.owner != request.user:
            return HttpResponse(status=401)
        form = ListingForm(request.POST, instance=listing_instance)
        if form.is_valid():
            saved_listing = form.save()
            if form.cleaned_data['tags'].strip():
                old_tags = Tag.objects.filter(listing=saved_listing)
                old_tags.delete()
                tags = form.cleaned_data['tags'].split(',')
                for single_tag in tags[:3]:
                    stripped_tag = single_tag.strip()
                    Tag.objects.create(tag_name=stripped_tag, listing=saved_listing)
            analytics.track(request.user.id, 'Listing edit', {
                'id': saved_listing.id,
                'role': saved_listing.role_title,
                'ip': get_client_ip(request),
            })
            return HttpResponseRedirect(reverse('main:detail', kwargs={'listing_id': saved_listing.id}))
        else:
            return HttpResponse('Listing edit form of %s is invalid.' % listing_id)
    else:
        listing = Listing.objects.get(id=listing_id)
        if listing.owner != request.user:
            return HttpResponseRedirect(reverse('main:detail', kwargs={'listing_id': listing.id}))

        listing_dict = model_to_dict(listing)

        tags = []
        for single_tag in Tag.objects.filter(listing=listing.id):
            tags.append(single_tag.tag_name)
        tags_string = ', '.join(tags)

        listing_dict['tags'] = tags_string
        form = ListingForm(listing_dict)

        return render(request, 'main/detail_edit.html', {'form': form, 'listing': listing})


def get_login(request):
    analytics.page(get_client_ip(request), 'No Auth', 'Login', {
        'url': request.get_full_path(),
    })
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

            # segment identify user
            analytics.identify(request.user.id, {
                'email': request.user.email,
                'ip': get_client_ip(request),
            })

            analytics.track(request.user.id, 'Login success')

            return redirect(settings.LOGIN_REDIRECT_URL)
        else:
            messages.error(request, 'The login link was invalid or has expired. Please try to log in again.')
    elif request.method == 'POST':
        # The user has submitted the email form.
        form = EmailForm(request.POST)
        if form.is_valid():
            email_login_link(request, form.cleaned_data['email'])
            messages.success(request, 'Login email sent! Please check your inbox and click on the link log in.')
            analytics.page(get_client_ip(request), 'No Auth', 'Login', {
                'url': request.get_full_path(),
            })
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
        "Yo! It's your login link from Avocado Jobs",
        render_to_string('main/token_auth_email.txt', {'current_site': current_site, 'data': data}, request=request),
        settings.DEFAULT_FROM_EMAIL,
        [email],
    )


@login_required
def get_logout(request):
    logout(request)
    messages.success(request.user.id, 'You have been logged out.')
    analytics.track(request.user.id, 'Log out')
    return redirect(settings.LOGOUT_REDIRECT_URL)
