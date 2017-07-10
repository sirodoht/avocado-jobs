from django import forms
from django.forms import ModelForm

from .models import Listing

class ListingForm(ModelForm):
    class Meta:
        model = Listing
        fields = ['role_title', 'role_subtitle', 'company_name', 'company_link',
            'company_image', 'company_base', 'company_desc', 'company_size',
            'company_funding', 'company_tech', 'role_desc', 'role_position',
            'role_tech', 'role_compensation', 'apply_link']
