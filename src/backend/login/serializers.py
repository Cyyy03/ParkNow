from rest_framework import serializers
from .models import Users, emailModel

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = '__all__'  # or specify fields you want

class EmailModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = emailModel
        fields = '__all__'
