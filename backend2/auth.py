import json
from urllib.request import urlopen
from jose import jwt

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
    return payload["sub"]


#try:
#    auth = "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlFrTXlORUl4TWtFeU1EVTVOemcyUVRrNU9FTkJSa1k1T1RkQ05rSTJPRGRDT1VORk9UY3dNQSJ9.eyJpc3MiOiJodHRwczovL2Rldi1neHFzZ3hpaS5ldS5hdXRoMC5jb20vIiwic3ViIjoiYXV0aDB8NWUyNDZiMjE1MTE1ZWEwZWFhMzEyNmJmIiwiYXVkIjpbImh0dHA6Ly9nb29nbGVfYXBpIiwiaHR0cHM6Ly9kZXYtZ3hxc2d4aWkuZXUuYXV0aDAuY29tL3VzZXJpbmZvIl0sImlhdCI6MTU4NzkyNTA0NSwiZXhwIjoxNTg4MDExNDQ1LCJhenAiOiJSelZtcXh5ZnZLYnZRTVo2dkszbVhONTF6T3NFQ2tQVSIsInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwifQ.Dlq0sGzGbvY6rCiNG-pCc5WW4nI9iGuzY9sRxk6iJNxUd3EEUfHIyTDSQmN0uzs_8Unsqtxk8TmGKqIobnqLbFg76Twkffszl4UFxnmFB5m8PNs9-qPlzmEMazG5M6NOIbiTwUU1h1uCmgcz5II9uiE_YMbJdqO-WAleAsWGGFHOq5sRAZTI9l6_fSdWc0yRx40agZJ8Mnopdpjt8vsHFDB8hQlE7l0xNrmOdJcnD3aj47-TzftPeGfnDZlimcCLu4fDay-S_NBgXz_Iu0kAe1c8rycr2N6dFxbiRbTUDXntYOpGZV_fKt5dY3MtaA1t8bOkmHXJH_vW0mhbBqEVBA"
#    token = get_token_auth_header(auth)
#    payload = validate_token_and_get_decoded_token(token)
#    username = get_username_from_auth_payload(payload)
#    data = {"date":"2020-04-26","from_timestamp":"96000","to_timestamp":"114000"}
#    insert_booking(data['date'], data['from_timestamp'], data['from_timestamp'], username)
#    print("test")
#except Exception as e:
#    print(e)