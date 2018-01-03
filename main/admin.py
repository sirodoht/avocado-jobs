from django.contrib import admin
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin

from .models import Application, Analytics

admin.site.register(Application)

class AnalyticsAdmin(admin.ModelAdmin):
    list_display = ('ip', 'querystring',)

admin.site.register(Analytics, AnalyticsAdmin)

class AvoAdmin(UserAdmin):
    list_display = ('id', 'username', 'date_joined', 'last_login',)

admin.site.unregister(User)
admin.site.register(User, AvoAdmin)
