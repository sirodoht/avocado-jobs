from django.test import TestCase
from django.utils import timezone
from django.urls import reverse

from .models import Listing, Category
from .forms import ListingForm


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
        cat = create_category(category_name="Frontend")
        listing = create_listing(
            role_title="Single listing",
            company_name="Red",
            category=cat,
        )
        response = self.client.get(reverse('main:index'))
        self.assertQuerysetEqual(
            response.context['categories'],
            ['<Category: Frontend>']
        )
        self.assertContains(response, listing.role_title)
        self.assertContains(response, listing.company_name)

    def test_two_listings(self):
        """
        The listings index page may display multiple listings.
        """
        cat_1 = create_category(category_name="Frontend")
        cat_2 = create_category(category_name="Backend")
        listing_1 = create_listing(
            role_title="Listing Frontend",
            company_name="Red",
            category=cat_1,
        )
        listing_2 = create_listing(
            role_title="Listing Backend",
            company_name="Red",
            category=cat_2,
        )
        response = self.client.get(reverse('main:index'))
        self.assertQuerysetEqual(
            response.context['categories'],
            ['<Category: Frontend>', '<Category: Backend>']
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
        cat = create_category(category_name="Frontend")
        listing = create_listing(
            role_title="Listing Frontend",
            company_name="Red",
            category=cat,
        )
        url = reverse('main:detail', args=(listing.id,))
        response = self.client.get(url)
        self.assertContains(response, listing.role_title)
        self.assertContains(response, listing.company_name)


class ListingFormTests(TestCase):
    def test_submission(self):
        """
        The listing form submits the details.
        """
        cat = create_category(category_name="Frontend")
        form_data = {
            'category': cat.id,
            'poster_email': 'person@email.com',
            'role_title': 'Frontend Developer',
            'company_name': 'House, Inc.',
            'company_link': 'http://house.ink',
            'company_image': 'http://house.ink/logo.png',
            'company_base': 'London, UK',
            'company_desc': 'the best of the best',
            'company_size': 12,
            'company_funding': '12m',
            'company_tech': 'Rust',
            'role_desc': 'the best of the best',
            'tags': 'red, green, blue',
            'role_type': 'F',
            'role_location': 'New York',
            'role_remote': 1,
            'role_tech': 'Rust',
            'role_compensation': '100k',
            'apply_link': 'http://house.ink/careers/123',
            'apply_email': 'apply@avocado.com',
        }
        form = ListingForm(data=form_data)
        self.assertTrue(form.is_valid())
        self.assertEqual(form.cleaned_data['poster_email'], form_data['poster_email'])
        self.assertEqual(form.cleaned_data['role_title'], form_data['role_title'])
        self.assertEqual(form.cleaned_data['company_name'], form_data['company_name'])
        self.assertEqual(form.cleaned_data['company_link'], form_data['company_link'])
        self.assertEqual(form.cleaned_data['company_image'], form_data['company_image'])
        self.assertEqual(form.cleaned_data['company_base'], form_data['company_base'])
        self.assertEqual(form.cleaned_data['company_desc'], form_data['company_desc'])
        self.assertEqual(form.cleaned_data['company_size'], form_data['company_size'])
        self.assertEqual(form.cleaned_data['company_funding'], form_data['company_funding'])
        self.assertEqual(form.cleaned_data['company_tech'], form_data['company_tech'])
        self.assertEqual(form.cleaned_data['role_desc'], form_data['role_desc'])
        self.assertEqual(form.cleaned_data['role_type'], form_data['role_type'])
        self.assertEqual(form.cleaned_data['role_location'], form_data['role_location'])
        self.assertEqual(form.cleaned_data['role_remote'], form_data['role_remote'])
        self.assertEqual(form.cleaned_data['role_tech'], form_data['role_tech'])
        self.assertEqual(form.cleaned_data['role_compensation'], form_data['role_compensation'])
        self.assertEqual(form.cleaned_data['apply_link'], form_data['apply_link'])
        self.assertEqual(form.cleaned_data['apply_email'], form_data['apply_email'])
        self.assertEqual(form.cleaned_data['tags'], form_data['tags'])
