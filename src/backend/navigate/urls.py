from .views import *
from django.urls import path, include
from . import views as view


urlpatterns = [
    path('', view.home, name='home'),
    path('oldmap', view.showmap, name='showmap'),
    path('<str:lat1>,<str:long1>,<str:lat2>,<str:long2>/', view.showroute, name='showroute'),
    path('f/<str:lat1>,<str:long1>,<str:lat2>,<str:long2>/', view.showroutef, name='showroutef'),
    path('geocode', view.geocode, name='geocode'),
    path('geocodef', view.geocodef, name='geocodef'),
    path('geocode/carpark/<int:pk>', view.geocode_carpark, name='geocode_carpark'),
    path('distance',view.distance, name="distance"),
    path('distancef',view.distancef, name="distancef"),
    path('map', view.map, name='map'),
    path('mapf', view.mapf, name='mapf'),
    path('mydata',view.mydata, name="mydata"),
    path('calculate/distance/<int:pk>/<int:pk2>',view.calculate_distance, name="calculate_distance"),
    path('directions', view.get_directions, name='directions'),
    path('directionsf', view.get_directionsf, name='directionsf'),
]
