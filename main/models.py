import shortuuid

from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User as DjUser


def generate_uuid() -> str:
    """Generate a UUID for an object."""
    return shortuuid.ShortUUID("abdcefghjkmnpqrstuvwxyz").random()[:8]


class User(DjUser):
    class Meta:
        proxy = True

    @property
    def has_listings(self):
        print('test does this work??:', self.listing_set.exists())
        return self.listing_set.exists()


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
    owner = models.ForeignKey(
        DjUser,
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

    users = models.ManyToManyField(DjUser, through='Application', related_name='applications')


    def __str__(self):
        return self.role_title + ' at ' + self.company_name


class Application(models.Model):
    user = models.ForeignKey(DjUser, on_delete=models.CASCADE)
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE)
    date_applied = models.DateField(default=timezone.now)

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
        return 'User with ID ' + str(self.user.id) + ' applied for ' + self.listing.role_title


class Tag(models.Model):
    tag_name = models.CharField(max_length=50)
    listing = models.ForeignKey(
        Listing,
        on_delete=models.CASCADE,
    )

    def __str__(self):
        return self.tag_name
