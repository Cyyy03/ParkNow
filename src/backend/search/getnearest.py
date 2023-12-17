import math
import requests

GOOGLE_API_KEY = 'AIzaSyAA0p1K8FyfuhCf9B52iQmMPZnjU3FsxZA'

def get_location_from_query(query):
    url = f"https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input={query}&inputtype=textquery&fields=geometry&key={GOOGLE_API_KEY}"
    
    try:
        response = requests.get(url, timeout=10)  # setting a timeout to the request
        response.raise_for_status()  # raise an HTTPError if the HTTP request returned an unsuccessful status code
        
        data = response.json()

        if data['status'] == 'OK':
            return data['candidates'][0]['geometry']['location']
        else:
            print(f"Error from Google Places API: {data.get('error_message', 'Unknown error')}")
            return None
            
    except requests.Timeout:
        print("Request to Google Places API timed out.")
        return None
    except requests.RequestException as e:
        print(f"Error while fetching data from Google Places API: {e}")
        return None


def haversine_distance(coord1, coord2):
    R = 6371.0  # radius of Earth in kilometers
    lat1 = math.radians(coord1[0])
    lon1 = math.radians(coord1[1])
    lat2 = math.radians(coord2[0])
    lon2 = math.radians(coord2[1])

    dlat = lat2 - lat1
    dlon = lon2 - lon1

    a = math.sin(dlat / 2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    distance = R * c
    return distance

def get_nearest_carparks(query, car_park_data_list, max_distance=1):  # Default distance is 1 km
    location = get_location_from_query(query)
    if not location:
        print("Unable to identify the location from the query. Please try a different query.")
        return []

    nearest_carparks = []
    for carpark in car_park_data_list:
        try:
            lat, lng = map(float, carpark["coordinates"])
            
            distance = haversine_distance((location['lat'], location['lng']), (lat, lng))
            if distance <= max_distance:  # use the max_distance here
                nearest_carparks.append(carpark)
        except ValueError as ve:
            print(f"Unexpected coordinates format for carpark: {carpark}")
    return nearest_carparks