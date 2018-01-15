import shortuuid

from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User


def generate_uuid():
    return shortuuid.ShortUUID('abdcefghkmnpqrstuvwxyzABDCEFGHKMNPQRSTUVWXYZ23456789').random(length=12)


class Application(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date_applied = models.DateField(default=timezone.now, null=True, blank=True)
    role = models.CharField(max_length=200)
    company = models.CharField(max_length=200)
    link = models.CharField(max_length=400, null=True, blank=True)
    salary = models.CharField(max_length=100, null=True, blank=True)
    notes = models.TextField(null=True, blank=True)

    TODO = 'todo'
    INITIAL = 'initial'
    NEED = 'need'
    AWAIT = 'await'
    SCHEDULED = 'scheduled'
    OFFER = 'offer'
    DECLINED = 'declined'
    REJECTED = 'rejected'
    STAGE_CHOICES = (
        (TODO, 'To Do'),
        (INITIAL, 'No initial response yet'),
        (NEED, 'I need to respond'),
        (AWAIT, 'Awaiting response'),
        (SCHEDULED, 'Interview scheduled'),
        (OFFER, 'Got offer'),
        (DECLINED, 'Declined'),
        (REJECTED, 'Got Rejected'),
    )
    stage = models.CharField(
        choices=STAGE_CHOICES,
        max_length=50,
    )

    def __str__(self):
        return self.user.email + ' - ' + self.role


class Reminder(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date_created = models.DateField(default=timezone.now)
    date_activation = models.DateTimeField()
    subject = models.CharField(max_length=400)
    body = models.TextField(null=True, blank=True)
    in_progress = models.BooleanField(default=False)

    def __str__(self):
        return self.user.username + ': ' + self.subject


class Analytic(models.Model):
    created_at = models.DateTimeField(default=timezone.now)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    ip = models.GenericIPAddressField(null=True, blank=True)
    path = models.CharField(max_length=400, null=True, blank=True)
    querystring = models.CharField(max_length=400, null=True, blank=True)

    def __str__(self):
        return self.ip


class Listing(models.Model):
    id = models.CharField(
        max_length=50,
        primary_key=True,
        default=generate_uuid,
        editable=False,
    )
    created_at = models.DateTimeField(default=timezone.now)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    role_title = models.CharField(max_length=50)
    company_name = models.CharField(max_length=50)
    company_url = models.URLField()
    location = models.CharField(max_length=40)
    salary = models.CharField(max_length=40)
    application_link = models.CharField(max_length=200)
    transaction_hash = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return self.role_title + ' at ' + self.company_name


class Tag(models.Model):
    value = models.CharField(max_length=50)
    listing = models.ForeignKey(
        Listing,
        on_delete=models.CASCADE,
    )

    def __str__(self):
        return self.value


class Address(models.Model):
    value = models.CharField(max_length=100)
    description = models.CharField(max_length=400, blank=True, null=True)
    last_used = models.DateTimeField()

    def __str__(self):
        return self.value
