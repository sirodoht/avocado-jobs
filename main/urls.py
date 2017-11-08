from django.conf.urls import url
from django.contrib import admin

from . import views

admin.site.site_header = 'Avocado Jobs administration'
app_name = 'main'
urlpatterns = [
    # /
    url(r'^$', views.index, name='index'),

    # /login
    url(r'^login/$', views.get_login, name='login'),

    # /auth
    url(r'^auth/$', views.token_post, name='auth'),

    # /logout
    url(r'^logout/$', views.get_logout, name='logout'),

    # /applications
    url(r'^applications/$', views.applications, name='applications'),

    # /applications/jobuuid/delete
    url(r'^applications/(?P<listing_id>[^/]*)/delete/$', views.applications_delete, name='applications_delete'),
]
