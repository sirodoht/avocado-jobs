import os, json
import stripe

from django.shortcuts import get_object_or_404, render
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.urls import reverse
from django.views import generic
from django.utils import timezone

from .models import Listing, Category, Tag
from .forms import ListingForm


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


def report(request, listing_id):
    return HttpResponse("You're looking at the report of listing %s." % listing_id)


def submit(request):
    if request.method == 'POST':
        form = ListingForm(request.POST)
        if form.is_valid():
            saved_listing = form.save()
            if form.cleaned_data['tags'].strip():
                tags = form.cleaned_data['tags'].split(',')
                for single_tag in tags[:3]:
                    stripped_tag = single_tag.strip()
                    Tag.objects.create(tag_name=stripped_tag, listing=saved_listing)
            return HttpResponseRedirect('/submit/%s/thank-you' % saved_listing.id)
    else:
        form = ListingForm()

    return render(request, 'main/submit.html', {'form': form})

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

def submit_thank(request, listing_id):
    return render(request, 'main/thank-you.html', {'listing_id': listing_id})
