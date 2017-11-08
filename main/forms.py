from django import forms


class EmailForm(forms.Form):
    """The email form for the login page."""
    email = forms.EmailField(label="Your email address")
