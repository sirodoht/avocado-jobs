from django.db import models


class Listing(models.Model):
    pub_date = models.DateTimeField('date published')
    role_title = models.CharField(max_length=50)
    role_subtitle = models.CharField(max_length=100)
    company_name = models.CharField(max_length=50)
    company_link = models.CharField(max_length=300)
    company_image = models.CharField(max_length=300, null=True, blank=True)
    company_base = models.CharField(max_length=100, null=True)
    company_desc = models.TextField()
    company_size = models.IntegerField(default=0)
    company_funding = models.CharField(max_length=50)
    company_tech = models.CharField(max_length=100)
    role_desc = models.TextField()
    role_position = models.CharField(max_length=50)
    role_tech = models.CharField(max_length=100)
    role_compensation = models.CharField(max_length=100)
    apply_link = models.CharField(max_length=300)
