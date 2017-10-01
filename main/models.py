import shortuuid

from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User


def generate_uuid() -> str:
    """Generate a UUID for an object."""
    return shortuuid.ShortUUID("abdcefghjkmnpqrstuvwxyz").random()[:8]


class Category(models.Model):
    category_name = models.CharField(max_length=50)

    def __str__(self):
        return self.category_name


class Listing(models.Model):
    id = models.CharField(
        max_length=50,
        primary_key=True,
        default=generate_uuid,
        editable=False,
    )
    user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
    )
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
    )
    pub_date = models.DateTimeField('date published', default=timezone.now)
    poster_email = models.EmailField()
    role_title = models.CharField(max_length=50)
    company_name = models.CharField(max_length=50)
    company_link = models.CharField(max_length=300)
    company_image = models.CharField(max_length=300, blank=True)
    company_base = models.CharField(max_length=100)
    company_desc = models.TextField()
    company_size = models.CharField(max_length=50)
    company_funding = models.CharField(max_length=50)
    company_tech = models.CharField(max_length=100)
    role_desc = models.TextField()

    FULLTIME = 'F'
    CONTRACT = 'C'
    ROLE_TYPE_CHOICES = (
        (FULLTIME, 'Full time'),
        (CONTRACT, 'Contract'),
    )
    role_type = models.CharField(
        choices=ROLE_TYPE_CHOICES,
        max_length=1,
    )

    role_remote = models.BooleanField()
    role_location = models.CharField(max_length=50, blank=True)
    role_tech = models.CharField(max_length=100)
    role_compensation = models.CharField(max_length=100)
    apply_link = models.CharField(max_length=300, blank=True)

    users = models.ManyToManyField(User, related_name='applications')

    def __str__(self):
        return self.role_title + " at " + self.company_name


class Tag(models.Model):
    tag_name = models.CharField(max_length=50)
    listing = models.ForeignKey(
        Listing,
        on_delete=models.CASCADE,
    )

    def __str__(self):
        return self.tag_name
