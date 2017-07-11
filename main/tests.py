import datetime

from django.test import TestCase
from django.utils import timezone
from django.urls import reverse

from .models import Listing


def create_listing(role_title, company_name, days):
    """
    Create a listing with the givens `role_title` and `company_name` and
    published the given number of `days` offset to now (negative for listings
    published in the past, positive for listings that have yet to be published).
    """
    time = timezone.now() + datetime.timedelta(days=days)
    return Listing.objects.create(
        role_title=role_title,
        company_name=company_name,
        pub_date=time
    )


class ListingModelTests(TestCase):
    def test_was_published_recently_with_future_listing(self):
        """
        was_published_recently() returns False for listings whose pub_date
        is in the future.
        """
        time = timezone.now() + datetime.timedelta(days=30)
        future_listing = Listing(pub_date=time)
        self.assertIs(future_listing.was_published_recently(), False)

    def test_was_published_recently_with_old_listing(self):
        """
        was_published_recently() returns False for listings whose pub_date
        is older than 1 day.
        """
        time = timezone.now() - datetime.timedelta(days=1, seconds=1)
        old_listing = Listing(pub_date=time)
        self.assertIs(old_listing.was_published_recently(), False)

    def test_was_published_recently_with_recent_listing(self):
        """
        was_published_recently() returns True for listings whose pub_date
        is within the last day.
        """
        time = timezone.now() - datetime.timedelta(hours=23, minutes=59, seconds=59)
        recent_listing = Listing(pub_date=time)
        self.assertIs(recent_listing.was_published_recently(), True)


class ListingIndexViewTests(TestCase):
    def test_no_listings(self):
        """
        If no listings exist, an appropriate message is displayed.
        """
        response = self.client.get(reverse('main:index'))
        self.assertEqual(response.status_code, 200)
        # self.assertContains(response, "No job listings are available.")
        self.assertQuerysetEqual(response.context['listings_list'], [])

    def test_past_listing(self):
        """
        Listings with a pub_date in the past are displayed on the
        index page.
        """
        create_listing(role_title="Past listing", company_name="Red", days=-30)
        response = self.client.get(reverse('main:index'))
        self.assertQuerysetEqual(
            response.context['listings_list'],
            ['<Listing: Past listing at Red>']
        )

    def test_future_listing(self):
        """
        Listings with a pub_date in the future aren't displayed on
        the index page.
        """
        create_listing(role_title="Future listing", company_name="Red", days=30)
        response = self.client.get(reverse('main:index'))
        # self.assertContains(response, "No job listings are available.")
        self.assertQuerysetEqual(response.context['listings_list'], [])

    def test_future_listing_and_past_listing(self):
        """
        Even if both past and future listings exist, only past listings
        are displayed.
        """
        create_listing(role_title="Past listing", company_name="Red", days=-30)
        create_listing(role_title="Future listing", company_name="Red", days=30)
        response = self.client.get(reverse('main:index'))
        self.assertQuerysetEqual(
            response.context['listings_list'],
            ['<Listing: Past listing at Red>']
        )

    def test_two_past_listings(self):
        """
        The listings index page may display multiple listings.
        """
        create_listing(role_title="Past listing 1", company_name="Red", days=-30)
        create_listing(role_title="Past listing 2", company_name="Red", days=-5)
        response = self.client.get(reverse('main:index'))
        self.assertQuerysetEqual(
            response.context['listings_list'],
            ['<Listing: Past listing 2 at Red>', '<Listing: Past listing 1 at Red>']
        )


class ListingDetailViewTests(TestCase):
    def test_future_listing(self):
        """
        The detail view of a listing with a pub_date in the future
        returns a 404 not found.
        """
        future_listing = create_listing(role_title='Future listing', company_name="Red", days=5)
        url = reverse('main:detail', args=(future_listing.id,))
        response = self.client.get(url)
        self.assertEqual(response.status_code, 404)

    def test_past_listing(self):
        """
        The detail view of a listing with a pub_date in the past
        displays the listing's text.
        """
        past_listing = create_listing(role_title='Past Listing', company_name="Red", days=-5)
        url = reverse('main:detail', args=(past_listing.id,))
        response = self.client.get(url)
        self.assertContains(response, past_listing.role_title)
