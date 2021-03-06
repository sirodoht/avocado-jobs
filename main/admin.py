from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User

from .models import Address, Analytic, Application, Listing, Reminder, Tag


# Users
class AvoAdmin(UserAdmin):
    list_display = ('id', 'username', 'date_joined', 'last_login',)

admin.site.unregister(User)
admin.site.register(User, AvoAdmin)


# Job applications
class ApplicationAdmin(admin.ModelAdmin):
    list_display = ('role', 'company', 'user', 'date_applied', 'link', 'salary', 'notes',)

admin.site.register(Application, ApplicationAdmin)


# Analytics
class AnalyticAdmin(admin.ModelAdmin):
    list_display = ('ip', 'user', 'created_at', 'path', 'querystring',)

admin.site.register(Analytic, AnalyticAdmin)


# Reminders
class ReminderAdmin(admin.ModelAdmin):
    list_display = ('user', 'date_created', 'date_activation', 'subject', 'in_progress',)

admin.site.register(Reminder, ReminderAdmin)


# Listings
class ListingAdmin(admin.ModelAdmin):
    list_display = ('id', 'role_title', 'company_name', 'user', 'created_at', 'transaction_hash',)

admin.site.register(Listing, ListingAdmin)


# Addresss
class AddressAdmin(admin.ModelAdmin):
    list_display = ('value', 'description', 'last_used',)

admin.site.register(Address, AddressAdmin)


# Tags
admin.site.register(Tag)
