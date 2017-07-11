from django.shortcuts import get_object_or_404, render
from django.http import HttpResponse, HttpResponseRedirect
from django.urls import reverse
from django.views import generic
from django.utils import timezone

from .models import Listing
from .forms import ListingForm


class IndexView(generic.ListView):
    template_name = 'main/index.html'
    context_object_name = 'listings_list'

    def get_queryset(self):
        """
        Return all listings, except those set to be published in the future.
        """
        return Listing.objects.filter(
            pub_date__lte=timezone.now()
        ).order_by('-pub_date')


class DetailView(generic.DetailView):
    template_name = 'main/detail.html'
    context_object_name = 'listing'

    def get_queryset(self):
        """
        Excludes any listings that aren't published yet.
        """
        return Listing.objects.filter(pub_date__lte=timezone.now())


def report(request, listing_id):
    return HttpResponse("You're looking at the report of listing %s." % listing_id)


def submit(request):
    if request.method == 'POST':
        form = ListingForm(request.POST)
        if form.is_valid():
            form.save()
            return HttpResponseRedirect('/submit/thank-you')
    else:
        form = ListingForm()

    return render(request, 'main/submit.html', {'form': form})

def submit_confirm(request):
    return render(request, 'main/thank-you.html')
