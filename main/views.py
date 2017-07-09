from django.shortcuts import render
from django.http import HttpResponse

from .models import Listing


def index(request):
    listings_list = Listing.objects.order_by('-pub_date')
    context = {'listings_list': listings_list}
    return render(request, 'main/index.html', context)

def detail(request, listing_id):
    return HttpResponse("You're looking at listing %s." % listing_id)

def report(request, listing_id):
    return HttpResponse("You're looking at the report of listing %s." % listing_id)
