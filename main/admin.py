from django.contrib import admin

from .models import Listing, Category, Tag

admin.site.register(Listing)
admin.site.register(Category)
admin.site.register(Tag)
