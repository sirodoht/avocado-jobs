from django.conf.urls import url

from . import views

app_name = 'main'
urlpatterns = [
    # /
    url(r'^$', views.IndexView.as_view(), name='index'),

    # /login
    url(r'^login/$', views.get_login, name='login'),

    # /auth
    url(r'^auth/$', views.token_post, name='auth'),

    # /logout
    url(r'^logout/$', views.get_logout, name='logout'),

    # /submissions
    url(r'^submissions/$', views.SubmissionsView.as_view(), name='submissions'),

    # /jobs/randomuuid/delete
    url(r'^jobs/(?P<pk>[^/]*)/delete/$', views.ListingDelete.as_view(), name='listing_delete'),

    # /jobs/randomuuid/edit
    url(r'^jobs/(?P<listing_id>[^/]*)/edit/$', views.listing_edit, name='listing_edit'),

    # /submit
    url(r'^submit/$', views.submit, name='submit'),

    # /submit/randomuuid/preview
    url(r'^submit/(?P<pk>[^/]*)/preview$', views.PreviewView.as_view(), name='submit_preview'),

    # /submit/payment
    url(r'^submit/(?P<listing_id>[^/]*)/payment$', views.submit_payment, name='submit_payment'),

    # /submit/thank-you
    url(r'^submit/(?P<listing_id>[^/]*)/thank-you$', views.submit_thank, name='submit_thank'),

    # /jobs/randomuuid/
    url(r'^jobs/(?P<pk>[^/]*)/$', views.DetailView.as_view(), name='detail'),

    # /jobs/randomuuid/report/
    url(r'^jobs/(?P<listing_id>[^/]*)/report/$', views.report, name='report'),
]
