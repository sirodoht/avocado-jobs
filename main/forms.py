from django import forms

from .models import Listing


class EmailForm(forms.Form):
    """The email form for the login page."""
    email = forms.EmailField(label="Your email address")


class ListingForm(forms.ModelForm):
    class Meta:
        model = Listing
        fields = ['role_title', 'company_title', 'company_url', 'location', 'salary', 'application_link']
