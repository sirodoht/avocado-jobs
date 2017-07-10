from django.db import models


class Listing(models.Model):
    pub_date = models.DateTimeField('date published', auto_now_add=True)
    role_title = models.CharField(max_length=50, blank=True)
    company_name = models.CharField(max_length=50, blank=True)
    company_link = models.CharField(max_length=300, blank=True)
    company_image = models.CharField(max_length=300, blank=True)
    company_base = models.CharField(max_length=100, blank=True)
    company_desc = models.TextField(blank=True)
    company_size = models.IntegerField(null=True)
    company_funding = models.CharField(max_length=50, blank=True)
    company_tech = models.CharField(max_length=100, blank=True)
    role_desc = models.TextField(blank=True)
    role_position = models.CharField(max_length=50, blank=True)
    role_tech = models.CharField(max_length=100, blank=True)
    role_compensation = models.CharField(max_length=100, blank=True)
    apply_link = models.CharField(max_length=300, blank=True)

    FRONTEND = 'FE'
    BACKEND = 'BE'
    FULLSTACK = 'FS'
    DEVOPS = 'DO'
    MOBILE = 'MB'
    CATEGORY_CHOICES = (
        (FRONTEND, 'Frontend'),
        (BACKEND, 'Backend'),
        (FULLSTACK, 'Fullstack'),
        (DEVOPS, 'Devops'),
        (MOBILE, 'Mobile'),
    )
    category = models.CharField(
        max_length=2,
        choices=CATEGORY_CHOICES,
        null=True,
    )

    def __str__(self):
        return self.role_title + " at " + self.company_name
