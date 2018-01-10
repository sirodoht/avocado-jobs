import shortuuid

from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User


def generate_uuid():
    """Generate a UUID for an object."""
    return shortuuid.ShortUUID("abdcefghjkmnpqrstuvwxyz").random()[:8]


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
    day = models.DateField()
    hour = models.TimeField()
    subject = models.CharField(max_length=400)
    body = models.TextField(null=True, blank=True)
    completed = models.BooleanField(default=False)

    # def __str__(self):
    #     return self.user


class Analytics(models.Model):
    querystring = models.CharField(max_length=400, null=True, blank=True)
    ip = models.GenericIPAddressField(null=True, blank=True)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        if self.ip and self.querystring:
            return self.ip + ': ' + self.querystring
        elif self.ip:
            return self.ip
        elif self.querystring:
            return 'none: ' + self.querystring
        else:
            return 'empty'
