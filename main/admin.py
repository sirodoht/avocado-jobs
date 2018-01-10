from django.contrib import admin
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin

from .models import Application, Analytics, Reminder


# Users
class AvoAdmin(UserAdmin):
    list_display = ('id', 'username', 'date_joined', 'last_login',)

admin.site.unregister(User)
admin.site.register(User, AvoAdmin)


# Job applications
admin.site.register(Application)


# Analytics
class AnalyticsAdmin(admin.ModelAdmin):
    list_display = ('ip', 'querystring', 'created_at',)

admin.site.register(Analytics, AnalyticsAdmin)


# Reminders
admin.site.register(Reminder)
