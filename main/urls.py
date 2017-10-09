from django.conf.urls import url

from . import views


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

    # /listings
    url(r'^listings/$', views.listings, name='listings'),

    # /jobs/jobuuid/delete
    url(r'^jobs/(?P<listing_id>[^/]*)/delete/$', views.listing_delete, name='listing_delete'),

    # /jobs/jobuuid/edit
    url(r'^jobs/(?P<listing_id>[^/]*)/edit/$', views.listing_edit, name='listing_edit'),

    # /create
    url(r'^create/$', views.create, name='create'),

    # /create/jobuuid/preview
    url(r'^create/(?P<listing_id>[^/]*)/preview$', views.create_preview, name='create_preview'),

    # /create/thank-you
    url(r'^create/(?P<listing_id>[^/]*)/thank-you$', views.create_thank, name='create_thank'),

    # /jobs/jobuuid/
    url(r'^jobs/(?P<listing_id>[^/]*)/$', views.listing_detail, name='detail'),

    # /jobs/jobuuid/report/
    url(r'^jobs/(?P<listing_id>[^/]*)/report/$', views.report, name='report'),
]
