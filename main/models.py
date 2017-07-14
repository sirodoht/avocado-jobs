from django.db import models
from django.utils import timezone


class Category(models.Model):
    category_name = models.CharField(max_length=50, null=True)

    def __str__(self):
        return self.category_name


class Listing(models.Model):
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
    )
    pub_date = models.DateTimeField('date published', default=timezone.now)
    poster_email = models.EmailField(null=True)
    role_title = models.CharField(max_length=50, blank=True)
    company_name = models.CharField(max_length=50, blank=True)
    company_link = models.CharField(max_length=300, blank=True)
    company_image = models.CharField(max_length=300, blank=True)
    company_base = models.CharField(max_length=100, blank=True)
    company_desc = models.TextField(blank=True)
    company_size = models.IntegerField(null=True, blank=True)
    company_funding = models.CharField(max_length=50, blank=True)
    company_tech = models.CharField(max_length=100, blank=True)
    role_desc = models.TextField(blank=True)
    role_position = models.CharField(max_length=50, blank=True)
    role_tech = models.CharField(max_length=100, blank=True)
    role_compensation = models.CharField(max_length=100, blank=True)
    apply_link = models.CharField(max_length=300, blank=True)

    def __str__(self):
        return self.role_title + " at " + self.company_name


class Tag(models.Model):
    tag_name = models.CharField(max_length=50)
    listing = models.ForeignKey(
        Listing,
        on_delete=models.SET_NULL,
        null=True,
    )

    def __str__(self):
        return self.tag_name
