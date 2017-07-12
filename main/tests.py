from django.test import TestCase
from django.utils import timezone
from django.urls import reverse

from .models import Listing, Category


def create_category(category_name):
    """
    Create a category given `category_name`.
    """
    return Category.objects.create(
        category_name=category_name,
    )

def create_listing(role_title, company_name, category):
    """
    Create a listing with the givens `role_title` and `company_name`.
    """
    return Listing.objects.create(
        role_title=role_title,
        company_name=company_name,
        category=category,
    )


class ListingIndexViewTests(TestCase):
    def test_no_listings(self):
        """
        If no listings exist, an appropriate message is displayed.
        """
        response = self.client.get(reverse('main:index'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "No job listings exist :(")
        self.assertQuerysetEqual(response.context['categories'], [])

    def test_listing(self):
        """
        The listings index page may display a single listing.
        """
        cat = create_category(category_name="FE")
        listing = create_listing(
            role_title="Single listing",
            company_name="Red",
            category=cat,
        )
        response = self.client.get(reverse('main:index'))
        self.assertQuerysetEqual(
            response.context['categories'],
            ['<Category: FE>']
        )
        self.assertContains(response, listing.role_title)
        self.assertContains(response, listing.company_name)

    def test_two_listings(self):
        """
        The listings index page may display multiple listings.
        """
        cat_1 = create_category(category_name="FE")
        cat_2 = create_category(category_name="BE")
        listing_1 = create_listing(
            role_title="Listing FE",
            company_name="Red",
            category=cat_1,
        )
        listing_2 = create_listing(
            role_title="Listing BE",
            company_name="Red",
            category=cat_2,
        )
        response = self.client.get(reverse('main:index'))
        self.assertQuerysetEqual(
            response.context['categories'],
            ['<Category: FE>', '<Category: BE>']
        )
        self.assertContains(response, listing_1.role_title)
        self.assertContains(response, listing_1.company_name)
        self.assertContains(response, listing_2.role_title)
        self.assertContains(response, listing_2.company_name)


class ListingDetailViewTests(TestCase):
    def test_listing(self):
        """
        The detail view of a listing displays the listing's content.
        """
        cat = create_category(category_name="FE")
        listing = create_listing(
            role_title="Listing FE",
            company_name="Red",
            category=cat,
        )
        url = reverse('main:detail', args=(listing.id,))
        response = self.client.get(url)
        self.assertContains(response, listing.role_title)
        self.assertContains(response, listing.company_name)
