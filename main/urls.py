from django.conf.urls import url

from . import views

app_name = 'main'
urlpatterns = [
    # ex: /
    url(r'^$', views.IndexView.as_view(), name='index'),
    # ex: /jobs/submit/
    url(r'^submit/$', views.submit, name='submit'),
    # ex: /jobs/5/
    url(r'^jobs/(?P<pk>[0-9]+)/$', views.DetailView.as_view(), name='detail'),
    # ex: /jobs/5/report/
    url(r'^jobs/(?P<listing_id>[0-9]+)/report/$', views.report, name='report'),
]
