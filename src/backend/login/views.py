from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.contrib.auth.hashers import make_password, check_password 
from .serializers import UserSerializer
from .models import Users, emailModel
from .token import create_token, verify_token
from django.core.exceptions import ObjectDoesNotExist
from django.db import IntegrityError
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
import json
import uuid
import pyotp
import base64
import re

# Email and OTP configurations
EMAIL_REGEX = r'^[\w\.-]+@[\w\.-]+\.\w+$'
smtp_server = 'smtp.qq.com'
smtp_port = 465
sender_email = '1270662610@qq.com'
sender_password = 'jacfkchuaejkihab'
EXPIRY_TIME = 100  # seconds

# Utility class and methods
class OTPKeyGenerator:
    @staticmethod
    def generate(email):
        return base64.b32encode(
            (str(email) + str(datetime.date(datetime.now())) + "Some Random Secret Key").encode()
        )
    
def send_otp_email(recipient_email, otp_value):
    subject = 'Your OTP Verification Code'
    body = f'Your OTP code is: {otp_value}'

    message = MIMEMultipart()
    message.attach(MIMEText(body, 'plain'))
    message['Subject'] = subject
    message['From'] = sender_email
    message['To'] = recipient_email

    try:
        with smtplib.SMTP_SSL(smtp_server, smtp_port) as server:
            server.set_debuglevel(1)
            server.login(sender_email, sender_password)
            server.sendmail(sender_email, recipient_email, message.as_string())
        print('OTP email sent successfully.')
    except Exception as e:
        print(f'Error sending OTP email: {str(e)}')

def remove_expired_accounts():
    """
    Remove inactive user accounts with expired OTPs.
    """
    now = datetime.now()
    for email_obj in emailModel.objects.all():
        email = email_obj.Email
        key = OTPKeyGenerator.generate(email)
        OTP = pyotp.TOTP(key, interval = EXPIRY_TIME)
        
        # Check if the associated user exists
        try:
            user = email_obj.user
        except Users.DoesNotExist:
            continue  # If user doesn't exist, skip this iteration
        
        # If the OTP is no longer valid and the user is still inactive, delete the user and related emailModel entry.
        if not OTP.verify(email_obj.otp) and not user.is_active:
            user.delete()  # This will cascade and delete associated emailModel entries as well.
    
# Create your views here.
class UserView(viewsets.ModelViewSet):
    serializer_class = UserSerializer 

    @action(detail=False, methods=['post'])
    def register(self, request):
        data = request.data.copy()  # Create a mutable copy of the QueryDict
        data.pop('csrfmiddlewaretoken', None)  # Remove the csrf token from the data
        # Authenticate registered username
        if Users.objects.filter(username=data['username']).exists():
            return Response({'success': False, 'message': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)

        email = data.get('email', '')
        if not re.match(EMAIL_REGEX, email):
            return Response({"message": "Invalid email format"}, status=status.HTTP_400_BAD_REQUEST)

        key = OTPKeyGenerator.generate(email)
        OTP = pyotp.TOTP(key, interval=EXPIRY_TIME)
        otp_value = OTP.now()
        
        try:
            send_otp_email(email, otp_value)
        except Exception as e:
            return Response({"message": "Failed to send OTP email. Try again later."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        try:
            user_data = {
                'id': uuid.uuid1(),
                'username': data['username'],
                'password': make_password(data['password']),
                'email': email  ,
                'is_active': False
                # ... add other fields as needed
            }
            user_instance = Users.objects.create(**data)
            emailModel.objects.create(Email=email, otp=otp_value, user=user_instance)
        except IntegrityError:
            return Response({"message": "Email already registered"}, status=status.HTTP_400_BAD_REQUEST)

        return Response({'success': True}, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['post'])
    def verify_email(self, request):
        data = request.data
        email = data.get('email', '')
        otp = data.get('otp', '')

        remove_expired_accounts()
        
        try:
            email_obj = emailModel.objects.get(Email=email)
            key = OTPKeyGenerator.generate(email)
            OTP = pyotp.TOTP(key, interval=EXPIRY_TIME)

            if OTP.verify(otp):
                if email_obj.user.is_active:
                    email_obj.user.email = email
                    email_obj.user.save()
                    return Response("Email changed successfully", status=status.HTTP_200_OK)
                else:
                    email_obj.user.is_active = True
                    email_obj.user.save()
                    return Response("Email verified successfully", status=status.HTTP_200_OK)
            else:
                return Response("OTP is wrong/expired", status=status.HTTP_400_BAD_REQUEST)
        except ObjectDoesNotExist:
            return Response("User does not exist", status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            # Ideally log the exception here
            return Response({"message": "An error occurred. Try again later."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action (detail = False, methods = ['post'])
    def login(self, request):
        data = request.data
        filter_user = Users.objects.filter(username = data['username'])
        if not len(filter_user):
            res = {
                'success': False,
                'mess': 'Username does not exist'
            }
            return Response(res)
        user = UserSerializer(filter_user, many = True).data[0]
        check_pass_result = check_password(data['password'], make_password(user['password']))
        if not check_pass_result:
            res = {
                'success': False,
                'mess': 'Wrong password'
            }
            return Response(res)
        
        res = {
            'success': True,
            'data': user
        }

        response = Response(res)
        response['Access-Control-Expose-Headers'] = 'auth'
        response['auth'] = create_token(user)
        return response
        
    @action (detail = False, methods = ['get'])
    def all_users(self, request):
        try:
            token = request.META.get('HTTP_AUTH')
            token = verify_token(token)
            if not token:
                res = {
                    'success': False,
                    'mess': 'Please relogin'
                }
                return Response(res)
            
            users = UserSerializer(Users.objects.all(), many = True).data
            res = {
                'success': True,
                'users': users
            }
            response = Response(res)
            response['Access-Control-Expose-Headers'] = 'auth'
            response['auth'] = token
            return response
        except:
            res = {
                'success': False,
                'mess': 'Please login'
            }
            return Response(res)
        
    @action(detail=True, methods=['post'])
    def update_password(self, request, pk=None):
        user = self.get_object()
        data = request.data.copy()
        data.pop('csrfmiddlewaretoken', None)
        pwd = data.get('password', '')
        if not pwd:
            res = {
                'success': False,
                'mess': 'New password is empty'
            }
            return Response(res)
        user.password = pwd
        user.save()
        res = {
            'success': True,
            'mess': 'Password updated'
        }
        return Response(res)
    
    @action(detail=True, methods=['post'])
    def update_email(self, request, pk=None):
        user = self.get_object()
        data = request.data.copy()
        data.pop('csrfmiddlewaretoken', None)
        email = data.get('email', '')
        if not re.match(EMAIL_REGEX, email):
            return Response({"message": "Invalid email format"}, status=status.HTTP_400_BAD_REQUEST)
        
        key = OTPKeyGenerator.generate(email)
        OTP = pyotp.TOTP(key, interval=EXPIRY_TIME)
        otp_value = OTP.now()

        try:
            send_otp_email(email, otp_value)
        except Exception as e:
            return Response({"message": "Failed to send OTP email. Try again later."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        # Remove the old email model
        try:
            old_email_obj = emailModel.objects.get(user=user)
            old_email_obj.delete()
        except ObjectDoesNotExist:
            pass

        try:
            emailModel.objects.create(Email=email, otp=otp_value, user=user)
        except IntegrityError:
            return Response({"message": "Email already registered"}, status=status.HTTP_400_BAD_REQUEST)
        
        res = {
            'success': True,
            'mess': 'Email updated'
        }
        return Response(res)
    
    def get_queryset(self):
        queryset = Users.objects.all()
        return queryset

    @action (detail = False, methods = ['get'])
    def get_id(self, request):
        email = request.GET.get('email', '')
        queryset = self.get_queryset()  # Call the get_queryset function
        user_id = None  # Initialize user_id as None
        
        # Iterate through the queryset to find the user with the specified email
        users_queryset = Users.objects.all()
        for user in users_queryset:
                if user.email == email:
                    user_id = user.id

        # Check if a user with the specified email was found
        if user_id is not None:
            return Response({'id': user_id}, status=status.HTTP_200_OK)
        else:
            return Response({'detail': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    # this method is just a view for sending OTP to change password
    @action(detail=False, methods=['post'])
    def send_otp(self, request):
        
        recipient_email = request.data.get('recipient_email')
        key = OTPKeyGenerator.generate(recipient_email)
        OTP = pyotp.TOTP(key, interval=EXPIRY_TIME)
        otp_value = OTP.now()

        # Call the send_otp_email function with the provided parameters
        send_otp_email(recipient_email, otp_value)

        # You can return a response indicating that the email has been sent
        return Response({'message': 'OTP email sent successfully.'}, status=status.HTTP_200_OK)
        
    # this method verifies otp for changing password, unlike verify_email above, which is for changing email  
    @action(detail=False, methods=['post'])
    def verify_otp(self, request): 
        data = request.data
        email = data.get('email', '')
        otp = data.get('otp', '')
        
        try:
            key = OTPKeyGenerator.generate(email)
            OTP = pyotp.TOTP(key, interval=EXPIRY_TIME)

            if OTP.verify(otp):
                return Response("OTP verified", status=status.HTTP_200_OK)
            else:
                return Response("OTP is wrong/expired", status=status.HTTP_400_BAD_REQUEST)
        except ObjectDoesNotExist:
            return Response("User does not exist", status=status.HTTP_404_NOT_FOUND)

    # check if password provided by user matches password in database before allowing user to change password
    @action(detail=False, methods=['post'])
    def check_pass(self, request):
        current_password = request.data.get('current_password', '')
        username = request.data.get('username', '')
        try:
            user = Users.objects.get(username=username)
            password = user.password
    
            # Compare the provided current password with the user's stored password
            if password == current_password:
                return Response({"password_match": True}, status=status.HTTP_200_OK)
            else:
                return Response({"password_match": False}, status=status.HTTP_200_OK)
        except ObjectDoesNotExist:
            return Response("User does not exist", status=status.HTTP_404_NOT_FOUND)
