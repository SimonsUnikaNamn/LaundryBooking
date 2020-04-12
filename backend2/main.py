import json

from auth import validate_auth_and_return_decoded_token, get_username_from_auth_payload
from controller import insert_booking, get_bookings_for_date, get_bookings_for_year


def insert_booking_request(request):
    try:
        payload = validate_auth_and_return_decoded_token(request)
        username = get_username_from_auth_payload(payload)
        data = request.get_json(silent=True)
        if 'date' not in data or data['date'] is None or 'from_timestamp' not in data or data['from_timestamp'] is None or \
                'to_timestamp' not in data or data['to_timestamp'] is None:
            return 'Expects date, from_timestamp and to_timestamp post data.', 400

        bookings = insert_booking(data.date, data.from_timestamp, data.to_timestamp, username)
        return json.dumps(bookings), 200
    except Exception as e:
        e_args = e.args
        error_info = e_args[0]
        error_code = e_args[1]
        return error_info["description"], error_code


def get_bookings_for_date_request(request):
    try:
        payload = validate_auth_and_return_decoded_token(request)
        date = request.args.get('date')
        if date is None:
            return 'Expects query parameter date', 400
        return json.dumps(get_bookings_for_date(date))
    except Exception as e:
        e_args = e.args
        error_info = e_args[0]
        error_code = e_args[1]
        return error_info["description"], error_code


def get_all_bookings_for_year_request(request):
    try:
        payload = validate_auth_and_return_decoded_token(request)
        year = request.args.get('year')
        if year is None:
            return 'Expects query parameter year', 400
        return json.dumps(get_bookings_for_year(year))
    except Exception as e:
        e_args = e.args
        error_info = e_args[0]
        error_code = e_args[1]
        return error_info["description"], error_code
