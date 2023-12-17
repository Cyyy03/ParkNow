from django.core.cache import cache
import requests
import json
import googlemaps
import pyproj

ACCESS_KEY = 'b5d97eb7-798e-4552-98ae-9ff271d0252f'
GOOGLE_API_KEY = 'AIzaSyAA0p1K8FyfuhCf9B52iQmMPZnjU3FsxZA'

gmaps = googlemaps.Client(key=GOOGLE_API_KEY)

def svy21_to_wgs84(easting, northing):
    # Ensure that always_xy parameter is set to True so that the input order is (easting, northing)
    transformer = pyproj.Transformer.from_crs("EPSG:3414", "EPSG:4326", always_xy=True)
    lon, lat = transformer.transform(easting, northing)
    return lat, lon

def get_full_address(lat, lon):
    # Check if the address is already cached
    cache_key = f"address_{lat}_{lon}"
    cached_address = cache.get(cache_key)
    if cached_address:
        return cached_address

    # Perform reverse geocoding to get the address
    reverse_geocode_result = gmaps.reverse_geocode((lat, lon))

    # Initialize address variable
    address = None

    if reverse_geocode_result:
        # Loop through the results to find a street address, ignore plus codes
        for result in reverse_geocode_result:
            if 'plus_code' in result['types']:
                address = str(lat) + ',' + str(lon)
            address = result.get('formatted_address')
            break  # Break after finding the first valid address

    # Check if we have found a valid address, else find the nearest street address
    if not address:
        # You can implement additional logic here to get the nearest street address
        # This might involve a secondary API call or a custom logic based on your needs
        address = 'Nearest address not found'

    # Cache the address for future use
    cache.set(cache_key, address, 86400)  # Cache for 1 day

    return address

def gettoken():
    url = "https://www.ura.gov.sg/uraDataService/insertNewToken.action"
    headers = {
        "AccessKey": ACCESS_KEY,
        'User-Agent': 'Mozilla/5.0',
    }
    r = requests.get(url, headers=headers)
    if r.status_code != 200:
        print(f"Failed to retrieve data: {r.status_code}")
        return {}

    # Check if the response is empty
    if not r.text.strip():
        print("Received empty response")
        return {}
    
    try:
        res = r.json()
    except json.JSONDecodeError:
        print("Failed to decaode JSON response")
        print("Response content:", r.text)
        return {}

    return res

def get_token_from_cache():
    """
    Retrieve the token from cache, or fetch a new one if it doesn't exist or has expired.
    """
    token = cache.get('ura_token')
    if not token:
        token_data = gettoken()
        token = token_data.get('Result')
        cache.set('ura_token', token, 3600)  # assuming token is valid for 1 hour
    return token

TOKEN = get_token_from_cache()

def getavailability():
    url = "https://www.ura.gov.sg/uraDataService/invokeUraDS?service=Car_Park_Availability"
    headers = {
        "AccessKey": ACCESS_KEY,
        "Token": TOKEN,
        'User-Agent': 'Mozilla/5.0',
    }
    r = requests.get(url, headers=headers)
    if r.status_code != 200:
        print(f"Failed to retrieve data: {r.status_code}")
        return {}

    # Check if the response is empty
    if not r.text.strip():
        print("Received empty response")
        return {}
    
    try:
        res = r.json()
    except json.JSONDecodeError:
        print("Failed to decode JSON response")
        print("Response content:", r.text)
        return {}

    return res

def getinfo():
    url = "https://www.ura.gov.sg/uraDataService/invokeUraDS?service=Car_Park_Details"
    headers = {
        "AccessKey": ACCESS_KEY,
        "Token": TOKEN,
        'User-Agent': 'Mozilla/5.0',
    }
    r = requests.get(url, headers=headers)
    if r.status_code != 200:
        print(f"Failed to retrieve data: {r.status_code}")
        return {}

    # Check if the response is empty
    if not r.text.strip():
        print("Received empty response")
        return {}
    
    try:
        res = r.json()
    except json.JSONDecodeError:
        print("Failed to decode JSON response")
        print("Response content:", r.text)
        return {}

    return res

def get_car_park_data_list():
    # Get car park availability data
    availability_data = cache.get('availability_data')
    
    if not availability_data:
        availability_data = getavailability()
        cache.set('availability_data', availability_data, 600)  # Cache for 10 minutes

    # Get car park details data
    info_data = cache.get('info_data')
    if not info_data:
        info_data = getinfo()
        cache.set('info_data', info_data, 600)  # Cache for 10 minutes

    availability_entries = availability_data.get('Result', [])
    info_entries = info_data.get('Result', [])

    car_park_data_list = []
    
    for availability_entry in availability_entries:
        car_park_id = availability_entry.get('carparkNo')
        matching_info_entry = next((info_entry for info_entry in info_entries if info_entry.get('ppCode') == car_park_id), None)
        
        if matching_info_entry:
            coordinates = matching_info_entry.get('geometries')[0].get('coordinates').split(',')
            if coordinates:
                lat, lon = svy21_to_wgs84(coordinates[0], coordinates[1])
                address = get_full_address(lat, lon)
            else:
                address = None

            car_park_data = {
                'CarParkID': car_park_id,
                'CarParkName': matching_info_entry.get('ppName'),
                'Address': address,
                'Availability': availability_entry.get('lotsAvailable'),
                'TotalLots': matching_info_entry.get('parkCapacity'),
                "coordinates":  svy21_to_wgs84(matching_info_entry.get('geometries')[0].get('coordinates').split(',')[0], matching_info_entry.get('geometries')[0].get('coordinates').split(',')[1]),
                "startTime": matching_info_entry.get('startTime'),
                "endTime": matching_info_entry.get('endTime'),
                "parkingSystem": matching_info_entry.get('parkingSystem'),
                "satdayMin": matching_info_entry.get('satdayMin'),
                "satdayRate": matching_info_entry.get('satdayRate'),
                "sunPHMin": matching_info_entry.get('sunPHMin'),
                "sunPHRate": matching_info_entry.get('sunPHRate'),
                "vehCat": matching_info_entry.get('vehCat'),
                "weekdayMin": matching_info_entry.get('weekdayMin'),
                "weekdayRate": matching_info_entry.get('weekdayRate'),
            }
            car_park_data_list.append(car_park_data)
    
    return car_park_data_list