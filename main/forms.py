from django import forms
from django.forms import ModelForm, Textarea, NumberInput

from .models import Listing


class ListingForm(ModelForm):
    tags = forms.CharField(
        label='Tags',
        max_length=300,
        required=False,
        help_text = 'Comma separated keywords (max 3) eg. frontend, react'
    )

    class Meta:
        model = Listing
        fields = ['category', 'role_title', 'company_name', 'company_link',
            'company_image', 'company_base', 'company_desc', 'company_size',
            'company_funding', 'company_tech', 'role_desc', 'role_position',
            'role_tech', 'role_compensation', 'apply_link']
        widgets = {
            'company_desc': Textarea(attrs={'cols': 50, 'rows': 3}),
            'role_desc': Textarea(attrs={'cols': 50, 'rows': 10}),
            'company_size': NumberInput(attrs={'min': 0}),
        }
        labels = {
            'company_desc': 'Company description',
            'role_desc': 'Role description',
            'company_link': 'Company URL',
            'company_desc': 'Company intro',
            'company_funding': 'Funding',
            'role_desc': 'Job description',
            'role_position': 'Position',
            'role_tech': 'Languages / tools',
            'role_compensation': 'Compensation',
        }
        help_texts = {
            'role_title': 'eg. Frontend Developer',
            'company_image': 'Provide a url with your company\'s logo. (optional)',
            'company_base': 'Where are the company\'s offices located? eg. New York City, USA',
            'company_link': 'eg. https://github.com',
            'company_desc': 'What does your company do?',
            'company_size': 'How many employees does your company have?',
            'company_funding': 'Has your company received funding? If so, how much? eg. $2m / Series A',
            'company_tech': 'What technologies and/or languages does your company mainly use? eg. Java, Scala',
            'role_desc': 'What does this role include? Responsibilities, requirements, benefits, etc.',
            'role_position': 'Is this a full time and part time role? Is this a remote role? eg. Remote full time',
            'role_tech': 'What technologies and/or languages is this role concerned with? eg. JavaScript, React',
            'role_compensation': 'What is the salary and/or equity for this role? eg. $70k - $110k / 0.25 - 0.5%',
            'apply_link': 'How can someone apply? eg. https://avocado-jobs.workable.com/apply/123',
        }
