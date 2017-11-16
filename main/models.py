import shortuuid

from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User


def generate_uuid():
    """Generate a UUID for an object."""
    return shortuuid.ShortUUID("abdcefghjkmnpqrstuvwxyz").random()[:8]


class Application(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date_applied = models.DateField(default=timezone.now)
    role = models.CharField(max_length=200)
    company = models.CharField(max_length=200)
    link = models.CharField(max_length=400, null=True, blank=True)
    salary = models.CharField(max_length=100, null=True, blank=True)
    notes = models.TextField(null=True, blank=True)

    INITIAL = 'initial'
    NEED = 'need'
    AWAIT = 'await'
    SCHEDULED = 'scheduled'
    OFFER = 'offer'
    DECLINED = 'declined'
    REJECTED = 'rejected'
    STAGE_CHOICES = (
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
