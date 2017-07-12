from django.shortcuts import get_object_or_404, render
from django.http import HttpResponse, HttpResponseRedirect
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


def report(request, listing_id):
    return HttpResponse("You're looking at the report of listing %s." % listing_id)


def submit(request):
    if request.method == 'POST':
        form = ListingForm(request.POST)
        if form.is_valid():
            saved_listing = form.save()
            tags = form.cleaned_data['tags'].split(',')
            for single_tag in tags[:3]:
                stripped_tag = single_tag.strip()
                Tag.objects.create(tag_name=stripped_tag, listing=saved_listing)
            return HttpResponseRedirect('/submit/thank-you')
    else:
        form = ListingForm()

    return render(request, 'main/submit.html', {'form': form})

def submit_confirm(request):
    return render(request, 'main/thank-you.html')
