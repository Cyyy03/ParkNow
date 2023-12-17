from django.shortcuts import render
from rest_framework import viewsets
from .serializers import SearchSerializer
from .models import Search
from . import getinfo
from .getinfo import get_car_park_data_list
from .getnearest import get_nearest_carparks
from django.core.cache import cache
from django.http import JsonResponse
import logging

logger = logging.getLogger(__name__)

def search_nearby_carparks(request):
    query = request.GET.get('query', '')
    max_distance = request.GET.get('max_distance')  # Get max_distance from URL parameters
    try:
        max_distance = float(max_distance) if max_distance else 1  # Set a default value if none is provided
    except ValueError:
        return JsonResponse({'error': 'Invalid max_distance value'}, status=400)
    
    car_park_data_list = cache.get('car_park_data_list')
    if not car_park_data_list:
        car_park_data_list = get_car_park_data_list()
        cache.set('car_park_data_list', car_park_data_list, 600)

    nearby_carparks = get_nearest_carparks(query, car_park_data_list, max_distance)

    return JsonResponse({'nearby_carparks': nearby_carparks})


def showdetails(request):
    # Get the car park data list from the cache
    car_park_data_list = cache.get('car_park_data_list')
    if not car_park_data_list:
        car_park_data_list = get_car_park_data_list()
        cache.set('car_park_data_list', car_park_data_list, 600)  # Cache for 10 minutes

    return render(request, 'carpark.html', {'car_park_data': car_park_data_list})

def get_carpark_details(request, carpark_id):
    car_park_data_list = cache.get('car_park_data_list')
    if not car_park_data_list:
        car_park_data_list = get_car_park_data_list()
        if not car_park_data_list:
            logger.error("Failed to get car park data list.")
            return JsonResponse({'error': 'Car park data is unavailable'}, status=500)
        cache.set('car_park_data_list', car_park_data_list, 600)
    
    carpark = next((cp for cp in car_park_data_list if cp["CarParkID"] == carpark_id), None)
    
    if carpark is None:
        logger.error(f"Carpark with ID {carpark_id} not found.")
        return JsonResponse({'error': 'Carpark not found'}, status=404)

    return JsonResponse({'carpark': carpark})