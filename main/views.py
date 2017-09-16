import os, time, json, base64

import stripe

from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.contrib.sites.shortcuts import get_current_site
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.urls import reverse_lazy
from django.views import generic
from django.forms import model_to_dict
from django.template.loader import render_to_string
from django.core.mail import send_mail
from django.core.signing import Signer

from .models import Listing, Category, Tag
from .forms import ListingForm, EmailForm
from avocado import settings


class IndexView(generic.ListView):
    template_name = 'main/index.html'
    context_object_name = 'categories'

    def get_queryset(self):
        """
        Return all listings
        """
        return Category.objects.order_by('id')


class DetailView(generic.DetailView):
    template_name = 'main/detail.html'
    model = Listing


class PreviewView(generic.DetailView):
    template_name = 'main/preview.html'
    model = Listing


class SubmissionsView(generic.ListView):
    template_name = 'main/submissions.html'
    model = Listing


class ListingDelete(generic.edit.DeleteView):
    model = Listing
    success_url = reverse_lazy('main:submissions')


def report(request, listing_id):
    return HttpResponse("You're looking at the report of listing %s." % listing_id)


@login_required
def submit(request):
    if request.method == 'POST':
        form = ListingForm(request.POST)
        if form.is_valid():
            saved_listing = form.save()
            # saved_listing.user = request.user
            if form.cleaned_data['tags'].strip():
                tags = form.cleaned_data['tags'].split(',')
                for single_tag in tags[:3]:
                    stripped_tag = single_tag.strip()
                    Tag.objects.create(tag_name=stripped_tag, listing=saved_listing)
            return HttpResponseRedirect('/submit/%s/preview' % saved_listing.id)
        else:
            return HttpResponse('Listing edit form of %s is invalid.' % listing_id)
    else:
        form = ListingForm()
        return render(request, 'main/submit.html', {'form': form})


@login_required
def submit_payment(request, listing_id):
    stripe_keys = {}
    stripe_keys['publishable_key'] = os.environ.get('STRIPE_PUBLISHABLE_KEY', 'pk_test_kkUF6UkQvYT5PpzVxfHzLQLv')
    stripe_keys['secret_key'] = os.environ.get('STRIPE_SECRET_KEY', 'sk_test_UNVwOYwTV7CkTFzLUhjASR08')

    stripe.api_key = stripe_keys['secret_key']

    try:
      data = json.loads(request.body.decode('utf-8'))
    except KeyError:
      HttpResponseServerError('Malformed data!')

    customer = stripe.Customer.create(
        email=data['email'],
        source=data['stripeToken'],
    )

    charge = stripe.Charge.create(
        customer=customer.id,
        amount=29900,
        currency='usd',
        description='Job listing for 2 months',
    )

    if charge['status'] == 'succeeded':
        return HttpResponse(status=204)
    else:
        response = {
            'status': False,
            'message': 'Unfortunately, there was an charge error. Please try again.',
        }
        return JsonResponse(response, status=400)


@login_required
def submit_thank(request, listing_id):
    return render(request, 'main/thank-you.html', {'listing_id': listing_id})


@login_required
def listing_edit(request, listing_id):
    if request.method == 'POST':
        listing_instance = Listing.objects.get(id=listing_id)
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
            return HttpResponseRedirect('/jobs/%s/' % saved_listing.id)
        else:
            return HttpResponse('Listing edit form of %s is invalid.' % listing_id)
    else:
        listing = Listing.objects.get(id=listing_id)
        listing_dict = model_to_dict(listing)

        tags = []
        for single_tag in Tag.objects.filter(listing=listing.id):
            tags.append(single_tag.tag_name)
        tags_string = ', '.join(tags)

        listing_dict['tags'] = tags_string
        form = ListingForm(listing_dict)

        return render(request, 'main/detail_edit.html', {'form': form, 'listing': listing})


def get_login(request):
    return render(request, 'main/login.html')


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
            messages.success(request, 'Login email sent! Please check your inbox and click on the link to be logged in.')
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
        fail_silently=False,
    )


@login_required
def get_logout(request):
    logout(request)
    messages.success(request, 'You have been logged out.')
    return redirect(settings.LOGOUT_REDIRECT_URL)
