import bleach
from django import forms
from django.forms import ModelForm, Textarea, NumberInput, URLInput

from .models import Listing


class ListingForm(ModelForm):
    tags = forms.CharField(
        label='Tags',
        max_length=300,
        required=False,
        help_text = 'Comma separated keywords (max 3) eg. frontend, react'
    )

    field_order = ['category', 'role_title', 'company_name', 'company_link',
            'company_image', 'company_base', 'company_desc', 'company_size',
            'company_funding', 'company_tech', 'role_desc', 'tags', 'role_type',
            'role_remote', 'role_location', 'role_tech', 'role_compensation',
            'apply_link', 'apply_email', 'poster_email']

    def clean_company_desc(self):
        data = self.cleaned_data['company_desc']
        cleaned_data = bleach.clean(data,
            tags=['br', 'b', 'i', 'ul', 'li'],
            attributes=['abbr'],
            styles=[],
            strip=True,
        )
        return cleaned_data

    def clean_role_desc(self):
        data = self.cleaned_data['role_desc']
        cleaned_data = bleach.clean(data,
            tags=['br', 'b', 'i', 'ul', 'li'],
            attributes=['abbr'],
            styles=[],
            strip=True,
        )
        return cleaned_data


    class Meta:
        model = Listing
        fields = ['category', 'role_title', 'company_name', 'company_link',
            'company_image', 'company_base', 'company_desc', 'company_size',
            'company_funding', 'company_tech', 'role_desc', 'role_type',
            'role_remote', 'role_location', 'role_tech', 'role_compensation',
            'apply_link', 'apply_email', 'poster_email']
        widgets = {
            'company_desc': Textarea(attrs={'cols': 50, 'rows': 3}),
            'role_desc': Textarea(attrs={'cols': 50, 'rows': 10}),
            'company_size': NumberInput(attrs={'min': 0}),
            'company_link': URLInput(attrs={'placeholder': 'https://'}),
            'company_image': URLInput(attrs={'placeholder': 'https://github.com/logo.png'}),
            'apply_link': URLInput(attrs={'placeholder': 'https://'}),
        }
        labels = {
            'company_desc': 'Company description',
            'role_desc': 'Role description',
            'company_link': 'Company URL',
            'company_desc': 'Company intro',
            'company_funding': 'Funding',
            'company_tech': 'Company stack',
            'role_desc': 'Job description',
            'role_type': 'Job type',
            'role_remote': 'Remote?',
            'role_location': 'Job location',
            'role_tech': 'Languages / tools',
            'role_compensation': 'Compensation',
            'apply_email': 'Apply email',
            'poster_email': 'Email',
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
            'role_remote': 'Is this a remote position?',
            'role_location': 'Where will this role work from? eg. London, UK',
            'role_tech': 'What technologies and/or languages is this role concerned with? eg. JavaScript, React',
            'role_compensation': 'What is the salary and/or equity for this role? eg. $70k - $110k / 0.25 - 0.5%',
            'apply_link': 'How can someone apply? eg. https://avocado-jobs.workable.com/apply/123',
            'apply_email': 'Enter an email in case this is the prefered way of applying. If both this and an \'apply link\' exist, only the link will appear. (optional)',
            'poster_email': 'The confirmation, along with an edit link for the posting will be sent at this email.',
        }
