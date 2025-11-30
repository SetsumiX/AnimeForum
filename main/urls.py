from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register, name='register'),
    path('login/', views.user_login, name='login'),
    path('logout/', views.user_logout, name='logout'),
    path('', views.home, name='home'),
    path('news/', views.news_page, name='news_page'),
    path('forum/', views.forums_page, name='forums_page'),
    path('create_thread/', views.create_thread, name='create_thread'),
]