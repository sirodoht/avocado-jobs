from django.contrib import admin
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin

from .models import Application, Reminder, Analytic


# Users
class AvoAdmin(UserAdmin):
    list_display = ('id', 'username', 'date_joined', 'last_login',)

admin.site.unregister(User)
admin.site.register(User, AvoAdmin)


# Job applications
admin.site.register(Application)


# Analytics
class AnalyticAdmin(admin.ModelAdmin):
    list_display = ('ip', 'user', 'created_at', 'path', 'querystring',)

admin.site.register(Analytic, AnalyticAdmin)


# Reminders
class ReminderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'date_created', 'date_activation', 'subject', 'in_progress',)

admin.site.register(Reminder, ReminderAdmin)
