from django.urls import path,re_path
from . import views

urlpatterns = [
    re_path('login/', views.login),
    re_path('register/', views.register),
    re_path('profile/', views.profile),
    re_path('get_is_superuser/', views.get_is_superuser),
]