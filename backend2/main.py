import json

from auth import validate_auth_and_return_decoded_token, get_username_from_auth_payload
from controller import insert_booking, get_bookings_for_date, get_bookings_for_year, delete_booking
import google.cloud.logging
import logging

client = google.cloud.logging.Client()
client.setup_logging()

standard_headers = {
        'Access-Control-Allow-Origin': 'https://wash-264217.appspot.com',
        'Access-Control-Allow-Credentials': 'true',
    }

def handle_error(e):
    logging.error(f"Handle_error: {json.dumps(str(e))}")
    e_args = e.args
    if type(e_args) is tuple:
        error_info = e_args[0]
        error_code = e_args[1]
        return json.dumps(error_info), error_code, standard_headers

    return str(e), 500, standard_headers


def handle_options():
    headers = {
        'Access-Control-Allow-Origin': 'https://wash-264217.appspot.com',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, DELETE',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Max-Age': '3600'
    }

    return '', 204, headers


def handle_return(result, code=200):
    return result, code, standard_headers


def insert_booking_request(request):
    if request.method == 'OPTIONS':
        return handle_options()

    try:
        logging.info(f'Trying to insert booking')
        payload = validate_auth_and_return_decoded_token(request)
        logging.info(f'Passed authorization')
        username = get_username_from_auth_payload(payload)
        data = request.get_json()
        if 'date' not in data or data['date'] is None or 'from_timestamp' not in data or data['from_timestamp'] is None or \
                'to_timestamp' not in data or data['to_timestamp'] is None or 'email' not in data or data['email'] is None:
            return 'Expects date, from_timestamp, to_timestamp and email post data.', 400

        bookings = insert_booking(data["date"], data["from_timestamp"], data["to_timestamp"], data["email"], username)
        return handle_return(json.dumps(bookings))
    except Exception as e:
        return handle_error(e)


def get_bookings_for_date_request(request):
    if request.method == 'OPTIONS':
        return handle_options()

    try:
        validate_auth_and_return_decoded_token(request)
        date = request.args.get('date')
        if date is None:
            return 'Expects query parameter date', 400
        return handle_return(json.dumps(get_bookings_for_date(date)))
    except Exception as e:
        return handle_error(e)


def get_all_bookings_for_year_request(request):
    if request.method == 'OPTIONS':
        return handle_options()

    try:
        validate_auth_and_return_decoded_token(request)
        year = request.args.get('year')
        if year is None:
            return 'Expects query parameter year', 400
        return handle_return(json.dumps(get_bookings_for_year(year)))
    except Exception as e:
        return handle_error(e)


def delete_booking_request(request):
    if request.method == 'OPTIONS':
        return handle_options()

    try:
        payload = validate_auth_and_return_decoded_token(request)
        username = get_username_from_auth_payload(payload)
        data = request.get_json()
        if 'id' not in data or data['id'] is None or 'date' not in data \
                or data['date'] is None:
            return 'Expects id and date data.', 400

        result = delete_booking(data['id'], data['date'], username)
        return handle_return(json.dumps(result))
    except Exception as e:
        return handle_error(e)
