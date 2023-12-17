import folium
from .getroute import get_route
import googlemaps
from datetime import datetime
from django.shortcuts import render, redirect, reverse
from django.http import JsonResponse
from django.core import serializers
from django.conf import settings
from .forms import *
from .models import *
import requests
import json
import urllib
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views.decorators.http import require_http_methods
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.core.exceptions import ObjectDoesNotExist

API_KEY = 'AIzaSyAA0p1K8FyfuhCf9B52iQmMPZnjU3FsxZA'

# Create your views here.
def home(request):
    context = {}
    return render(request, 'home.html',context)

def showmap(request):
    return render(request, 'showmap.html')

def showroute(request, lat1, long1, lat2, long2):
    figure = folium.Figure()
    lat1, long1, lat2, long2 = float(lat1), float(long1), float(lat2), float(long2)
    route = get_route(long1, lat1, long2, lat2)
    m = folium.Map(location=[(route["start_point"][0]), (route["start_point"][1])], zoom_start=10)
    m.add_to(figure)
    folium.PolyLine(route['route'], color="blue", weight=8, opacity=0.6).add_to(m)
    folium.Marker(location=route['start_point'], icon=folium.Icon(color='green', icon='play')).add_to(m)
    folium.Marker(location=route['end_point'], icon=folium.Icon(color='red', icon='stop')).add_to(m)
    figure.render()
    context = {'map': figure}
    return render(request, 'showroute.html', context)

def showroutef(request, lat1, long1, lat2, long2):
    lat1, long1, lat2, long2 = float(lat1), float(long1), float(lat2), float(long2)
    route = get_route(long1, lat1, long2, lat2)
    route_data = {
        'start_point': route['start_point'],
        'end_point': route['end_point'],
        'route_path': route['route']
    }
    return JsonResponse(route_data)

def geocode(request):
    carparks = Carparks.objects.all()
    context = {
        'carparks': carparks,
    }
    return render(request, 'geocode.html',context)

def geocodef(request):
    carparks = Carparks.objects.all()
    # Serialize the queryset
    carparks_json = serializers.serialize('json', carparks)
    return JsonResponse(carparks_json, safe=False)

def geocode_carpark(request,pk):
    carpark = Carparks.objects.get(id=pk)
    # check whether we have the data in the database that we need to calculate the geocode
    if carpark.address and carpark.country and carpark.zipcode and carpark.city != None: 
        # creating string of existing location data in database
        address_string = str(carpark.address)+", "+str(carpark.zipcode)+", "+str(carpark.city) +", "+str(carpark.country)
        print(address_string)

        # geocode the string
        gmaps = googlemaps.Client(key= settings.GOOGLE_API_KEY)
        intermediate = json.dumps(gmaps.geocode(str(address_string))) 
        intermediate2 = json.loads(intermediate)
        latitude = intermediate2[0]['geometry']['location']['lat']
        longitude = intermediate2[0]['geometry']['location']['lng']
        print(latitude)
        print(longitude)
        # save the lat and long in our database
        carpark.latitude = latitude
        carpark.longitude = longitude
        carpark.save()
        return redirect('geocode')
    else:
        return redirect('geocode')
    
@csrf_exempt  # Use this decorator if you want to exempt the CSRF token requirement
def distance(request):
    if request.method == 'POST':
        # Extract start and end addresses from POST request
        start_address = request.POST.get('start_address')
        end_address = request.POST.get('end_address')
        
        if start_address and end_address:
            gmaps = googlemaps.Client(key=settings.GOOGLE_API_KEY)
            now = datetime.now()
            
            # Use the addresses provided by the user
            calculate = json.dumps(gmaps.distance_matrix(start_address,
                                                         end_address,
                                                         mode="driving",
                                                         departure_time=now)) 
            calculate2 = json.loads(calculate)

            result = calculate2
            distance = calculate2['rows'][0]['elements'][0]['distance']['value']
            duration = calculate2['rows'][0]['elements'][0]['duration']['text']

            context = {
                'result': result,
                'distance': distance,
                'duration': duration
            }

            return render(request, 'distance.html', context)
        else:
            # Handle the case where the input is invalid or missing
            context = {'error': 'Please provide both a start and an end address.'}
            return render(request, 'distance.html', context)

    # If it's not a POST request, render the form for user input
    return render(request, 'distance.html')

@method_decorator(csrf_exempt, name='dispatch')
@require_http_methods(["POST"])
@csrf_exempt
def distancef(request):
    # Extract start and end addresses from POST request
    start_address = request.POST.get('start_address')
    end_address = request.POST.get('end_address')
    
    if start_address and end_address:
        gmaps = googlemaps.Client(key=settings.GOOGLE_API_KEY)
        now = datetime.now()
        
        # Use the addresses provided by the user
        calculate = json.dumps(gmaps.distance_matrix(start_address,
                                                     end_address,
                                                     mode="driving",
                                                     departure_time=now)) 
        calculate2 = json.loads(calculate)

        if 'rows' in calculate2 and calculate2['rows']:
            distance_value = calculate2['rows'][0]['elements'][0]['distance']['value']
            duration_text = calculate2['rows'][0]['elements'][0]['duration']['text']

            distance_data = {
                'status': 'OK',
                'distance': distance_value,  # in meters
                'duration': duration_text    # as a string
            }
        else:
            distance_data = {
                'status': 'FAILED',
                'error': 'Could not retrieve distance information.'
            }

        return JsonResponse(distance_data)
    else:
        # Return error if start or end address is not provided
        return JsonResponse({'status': 'FAILED', 'error': 'Both start and end addresses are required.'}, status=400)


def calculate_distance(request,pk,pk2):
    location1 = Carparks.objects.get(id=pk)
    location2 = Carparks.objects.get(id=pk2)

    result = Carparks.objects.all()
    context = {
        'result':result,
    }
    return render(request, 'distance.html',context)

def map(request):
    key = settings.GOOGLE_API_KEY
    context = {
        'key':key,
    }
    return render(request, 'map.html',context)

def mapf(request):
    key = settings.GOOGLE_API_KEY
    # Return the key as a JSON response
    return JsonResponse({'key': key})

def mydata(request):
    result_list = list(Carparks.objects\
                .exclude(latitude__isnull=True)\
                .exclude(longitude__isnull=True)\
                .exclude(latitude__exact='')\
                .exclude(longitude__exact='')\
                .values('id',
                        'name', 
                        'latitude',
                        'longitude',
                        'country',
                        ))
  
    return JsonResponse(result_list, safe=False)

@csrf_exempt
def get_directions(request):
    if request.method == 'POST':
        start_address = request.POST.get('start_address')
        end_address = request.POST.get('end_address')
        
        # Use Google Maps Geocoding API to get lat and lng for start_address
        START_ENDPOINT = f"https://maps.googleapis.com/maps/api/geocode/json?address={start_address}&key={API_KEY}"
        response_start = requests.get(START_ENDPOINT)
        start_data = response_start.json()
        source_latitude = start_data['results'][0]['geometry']['location']['lat']
        source_longitude = start_data['results'][0]['geometry']['location']['lng']

        # Use Google Maps Geocoding API to get lat and lng for end_address
        END_ENDPOINT = f"https://maps.googleapis.com/maps/api/geocode/json?address={end_address}&key={API_KEY}"
        response_end = requests.get(END_ENDPOINT)
        end_data = response_end.json()
        destination_latitude = end_data['results'][0]['geometry']['location']['lat']
        destination_longitude = end_data['results'][0]['geometry']['location']['lng']

        # Render the route_display.html template with the coordinates obtained
        return render(request, 'route_display.html', {
            'source_lat': source_latitude,
            'source_lng': source_longitude,
            'dest_lat': destination_latitude,
            'dest_lng': destination_longitude
        })

    return render(request, 'directions.html')

@csrf_exempt
def get_directionsf(request):
    if request.method == 'POST':
        start_address = request.POST.get('start_address')
        end_address = request.POST.get('end_address')
        
        # Use Google Maps Geocoding API to get lat and lng for start_address
        START_ENDPOINT = f"https://maps.googleapis.com/maps/api/geocode/json?address={urllib.parse.quote(str(start_address))}&key={API_KEY}"
        response_start = requests.get(START_ENDPOINT)
        start_data = response_start.json()
        
        if not start_data['results']:
            print(start_address)
            return JsonResponse({'error': 'Start address not found'}, status=404)
            
        
        source_latitude = start_data['results'][0]['geometry']['location']['lat']
        source_longitude = start_data['results'][0]['geometry']['location']['lng']

        # Use Google Maps Geocoding API to get lat and lng for end_address
        END_ENDPOINT = f"https://maps.googleapis.com/maps/api/geocode/json?address={urllib.parse.quote(str(end_address))}&key={API_KEY}"
        response_end = requests.get(END_ENDPOINT)
        end_data = response_end.json()
        
        if not end_data['results']:
            return JsonResponse({'error': 'End address not found'}, status=404)

        destination_latitude = end_data['results'][0]['geometry']['location']['lat']
        destination_longitude = end_data['results'][0]['geometry']['location']['lng']
        
        directions_data = {
            'source_lat': source_latitude,
            'source_lng': source_longitude,
            'dest_lat': destination_latitude,
            'dest_lng': destination_longitude
        }
        
        return JsonResponse(directions_data)
    
    # If it's not a POST request, you might still want to render the initial form
    return render(request, 'directions.html')

def generate_links(request, carpark_name):
    try:
        # Assume 'name' is the field of the carpark model that stores the carpark's name.
        # Also assuming that carpark_name is passed in a format that is URL-safe and matches the format stored in the database.
        carpark_name = urllib.parse.unquote(carpark_name)  # Decode URL-encoded carpark name
        carpark = Carparks.objects.get(name=carpark_name)
        # Assuming carpark has fields latitude and longitude
        google_maps_link = f"https://www.google.com/maps/search/?api=1&query={carpark.latitude},{carpark.longitude}"
        apple_maps_link = f"http://maps.apple.com/?q={carpark.latitude},{carpark.longitude}"
        carpark_url = f"{request.build_absolute_uri('/')[:-1]}{request.get_full_path()}"
        
        links = {
            'google_maps': google_maps_link,
            'apple_maps': apple_maps_link,
            'url_link': carpark_url
        }
        return JsonResponse(links)
    except Carparks.DoesNotExist:
        return JsonResponse({'error': 'Carpark not found'}, status=404)