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
