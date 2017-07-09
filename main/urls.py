from django.conf.urls import url

from . import views

app_name = 'main'
urlpatterns = [
    # ex: /
    url(r'^$', views.index, name='index'),
    # ex: /jobs/5/
    url(r'^jobs/(?P<listing_id>[0-9]+)/$', views.detail, name='detail'),
    # ex: /jobs/5/report/
    url(r'^(jobs/(?P<listing_id>[0-9]+)/report/$', views.report, name='report'),
]
