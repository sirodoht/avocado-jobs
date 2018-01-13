from django.conf.urls import url
from django.contrib import admin

from . import views

admin.site.site_header = 'Avocado Jobs administration'
app_name = 'main'
urlpatterns = [
    # /
    url(r'^$', views.index, name='index'),

    # /login/
    url(r'^login/$', views.get_login, name='login'),

    # /auth/
    url(r'^auth/$', views.token_post, name='auth'),

    # /logout/
    url(r'^logout/$', views.get_logout, name='logout'),

    # /about/
    url(r'^about/$', views.about, name='about'),

    # /applications/
    url(r'^applications/$', views.applications, name='applications'),

    # /applications/<application_id>/
    url(r'^applications/(?P<application_id>[^/]*)/$', views.applications_delete, name='applications_delete'),

    # /reminders/
    url(r'^reminders/$', views.reminders, name='reminders'),

    # /reminders/<reminder_id>/
    url(r'^reminders/(?P<reminder_id>[^/]*)/$', views.reminders_delete, name='reminders_delete'),

    # /board/
    url(r'^board/$', views.board, name='board'),

    # /board/add/
    url(r'^board/add/$', views.board_add, name='board_add'),

    # /board/payment/
    url(r'^board/payment/$', views.board_payment, name='board_payment'),
]
