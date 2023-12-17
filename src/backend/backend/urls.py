"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
import login.views
import search.views
import favorites.views
from navigate.views import showmap, showroute, generate_links
from search.views import search_nearby_carparks, showdetails, get_carpark_details

router = routers.DefaultRouter()
router.register(r'users', login.views.UserView, 'users')
router.register(r'favorites', favorites.views.FavoritesView, 'favorites')


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include(router.urls)),
    path('users/<int:pk>/update_password/', login.views.UserView.as_view({'post': 'update_password'}), name='update_password'),
    path('users/<int:pk>/update_email/', login.views.UserView.as_view({'post': 'update_email'}), name='update_email'),
    path('users/<int:pk>/favorites/', favorites.views.get_user_favorites, name='get_user_favorites'),
    path('users/<int:pk>/favorites/add/', favorites.views.add_to_favorites, name='add_to_favorites'),
    path('search/', search.views.search_nearby_carparks, name='search_nearby_carparks'),
    path('carpark/<str:carpark_id>/', get_carpark_details, name='get_carpark_details'),
    path('carpark/generate_links/<str:carpark_name>/', generate_links, name='generate_links'),
    path('details/', showdetails, name='showdetails'),
    path('navigate/', include('navigate.urls')),
]
