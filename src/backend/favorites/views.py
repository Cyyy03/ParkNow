from django.shortcuts import render
from rest_framework import viewsets
from .serializers import FavoritesSerializer
from django.contrib.auth.models import User
from rest_framework.decorators import api_view
from django.http import JsonResponse
from .models import Favorites
from django.http import Http404
from django.shortcuts import get_object_or_404
import uuid
import logging
from django.core.exceptions import ValidationError
from django.db import connection

logger = logging.getLogger(__name__)

# Create your views here.

class FavoritesView(viewsets.ModelViewSet):
    serializer_class = FavoritesSerializer
    queryset = Favorites.objects.all()
    
@api_view(['GET'])
def get_user_favorites(request, pk):
    try:
        user = User.objects.get(pk=pk)
        favorites = Favorites.objects.filter(user=user)
        serializer = FavoritesSerializer(favorites, many=True)
        return JsonResponse(serializer.data, safe=False)
    except User.DoesNotExist:
        return JsonResponse({'error': 'User not found.'}, status=404)
    except Favorites.DoesNotExist:
        return JsonResponse({'error': 'Favorites not found for the given user ID.'}, status=404)

@api_view(['POST'])
def add_to_favorites(request, pk):
    carpark_id = request.data.get('carpark_id')
    if not carpark_id:
        return JsonResponse({'error': 'Carpark ID is required.'}, status=400)

    try:
        user = User.objects.get(pk=pk)
        favorites, created = Favorites.objects.get_or_create(user=user)
        if carpark_id not in favorites.carparks:
            favorites.carparks.append(carpark_id)
            favorites.save()
        return JsonResponse({'status': 'Carpark added to favorites.'})
    except User.DoesNotExist:
        return JsonResponse({'error': 'User not found.'}, status=404)
    except Favorites.DoesNotExist:
        return JsonResponse({'error': 'Favorites not found for the given user.'}, status=404)

