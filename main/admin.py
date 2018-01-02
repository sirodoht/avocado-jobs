from django.contrib import admin
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin

from .models import Application, Analytics

admin.site.register(Application)
admin.site.register(Analytics)

class AvoAdmin(UserAdmin):
    list_display = ('id', 'username', 'date_joined', 'last_login',)

admin.site.unregister(User)
admin.site.register(User, AvoAdmin)
