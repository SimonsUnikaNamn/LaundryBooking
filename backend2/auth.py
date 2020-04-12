import json
from urllib.request import urlopen

from jose import jwt

from controller import insert_booking

API_AUDIENCE = "http://google_api"
ALGORITHMS = ["RS256"]
AUTH0_DOMAIN = "dev-gxqsgxii.eu.auth0.com"


def get_token_auth_header(auth):
    if not auth:
        raise Exception({"code": "authorization_header_missing",
                        "description":
                            "Authorization header is expected"}, 401)

    parts = auth.split()

    if parts[0].lower() != "bearer":
        raise Exception({"code": "invalid_header",
                        "description":
                            "Authorization header must start with"
                            " Bearer"}, 401)
    elif len(parts) == 1:
        raise Exception({"code": "invalid_header",
                        "description": "Token not found"}, 401)
    elif len(parts) > 2:
        raise Exception({"code": "invalid_header",
                        "description":
                            "Authorization header must be"
                            " Bearer token"}, 401)

    token = parts[1]
    return token


def validate_auth_and_return_decoded_token(request):
    auth = request.headers.get("Authorization", None)
    token = get_token_auth_header(auth)
    return validate_token_and_get_decoded_token(token)


def validate_token_and_get_decoded_token(token):
    jsonurl = urlopen("https://" + AUTH0_DOMAIN + "/.well-known/jwks.json")
    read_url = jsonurl.read().decode("utf-8")
    jwks = json.loads(read_url)
    unverified_header = jwt.get_unverified_header(token)
    rsa_key = {}
    for key in jwks["keys"]:
        if key["kid"] == unverified_header["kid"]:
            rsa_key = {
                "kty": key["kty"],
                "kid": key["kid"],
                "use": key["use"],
                "n": key["n"],
                "e": key["e"]
            }

    if not rsa_key:
        raise Exception({"code": "invalid_header",
                         "description": "Unable to find appropriate key"}, 401)

    try:
        payload = jwt.decode(
            token,
            rsa_key,
            algorithms=ALGORITHMS,
            audience=API_AUDIENCE,
            issuer="https://" + AUTH0_DOMAIN + "/"
        )
    except jwt.ExpiredSignatureError:
        raise Exception({"code": "token_expired",
                         "description": "token is expired"}, 401)
    except jwt.JWTClaimsError:
        raise Exception({"code": "invalid_claims",
                         "description":
                             "incorrect claims,"
                             "please check the audience and issuer"}, 401)
    except Exception:
        raise Exception({"code": "invalid_header",
                         "description":
                             "Unable to parse authentication"
                             " token."}, 401)
    return payload


def get_username_from_auth_payload(payload):
    return payload["gty"]


#try:
#    auth = "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlFrTXlORUl4TWtFeU1EVTVOemcyUVRrNU9FTkJSa1k1T1RkQ05rSTJPRGRDT1VORk9UY3dNQSJ9.eyJpc3MiOiJodHRwczovL2Rldi1neHFzZ3hpaS5ldS5hdXRoMC5jb20vIiwic3ViIjoiVXlDdHNzNjBSdzV3U3FEUWVQSWZvV3Y3NVNhbDJUWURAY2xpZW50cyIsImF1ZCI6Imh0dHA6Ly9nb29nbGVfYXBpIiwiaWF0IjoxNTg2Njc1OTQyLCJleHAiOjE1ODY3NjIzNDIsImF6cCI6IlV5Q3RzczYwUnc1d1NxRFFlUElmb1d2NzVTYWwyVFlEIiwiZ3R5IjoiY2xpZW50LWNyZWRlbnRpYWxzIn0.S4e8ZxaVY_7r7cTgTkE1eA3Z7J1aX_sGLhzXvgalhayvVChZSpHcH3TKWZ-f29GjZ0XWGoGzqxyTAAo7Q4HZK7MoqI1wUsZfuALe94uwaWrx-RhFLXKDq4TLhwyvP1VoG3FQSEAMc4srh_ckRP7tiFuMYmalldODTLw1ARO5CXqt9nd5kUjgOGaPn9-kS8_IMMEmqDvtLfpoO6uFdj44791oLmh4_Kwrl_8rmKFQ3dy7pSfvj5DjHN9sRpw0J2wjXN1BPzT5YC-zZYC8sqHBSNUYtq7GBSZKRBhWUbcmalMgMGH_nSELbSjOFONTpWmHvzLhl7DLfsMY4j7WPLYA8g"
#    token = get_token_auth_header(auth)
#    payload = validate_token_and_get_decoded_token(token)
#    username = get_username_from_auth_payload(payload)
#    insert_booking("2020-04-04", 1000, 2000, username)
#    print("test")
#except Exception as e:
#    print(e)