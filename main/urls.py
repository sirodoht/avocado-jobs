from django.conf.urls import url

from . import views

app_name = 'main'
urlpatterns = [
    # /
    url(r'^$', views.IndexView.as_view(), name='index'),
    # /jobs/submit/
    url(r'^submit/$', views.submit, name='submit'),
    # /jobs/submit/thank-you
    url(r'^submit/(?P<listing_id>[^/]*)/thank-you$', views.submit_confirm, name='submit-confirm'),
    # ex: /jobs/randomuuid/
    url(r'^jobs/(?P<pk>[^/]*)/$', views.DetailView.as_view(), name='detail'),
    # ex: /jobs/randomuuid/report/
    url(r'^jobs/(?P<listing_id>[^/]*)/report/$', views.report, name='report'),
]
