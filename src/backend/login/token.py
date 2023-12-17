import jwt
import time

def create_token(user):
    payload = {
        'username': user['username'],
        'id': user['id'],
        'email': user['email'],
        'iat': int(time.time()),
        'exp': int(time.time()) + 60 * 5  # Increased expiry to 5 minutes
    }

    token = jwt.encode(payload, 'secret', algorithm='HS256')
    return token

def verify_token(token):
    try:
        payload = jwt.decode(token, 'secret', algorithms=['HS256'])
        token = create_token(payload)
        return token
    except:
        return False
