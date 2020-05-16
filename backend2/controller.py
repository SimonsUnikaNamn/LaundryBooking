import uuid

import firebase_admin
from firebase_admin import db

firebase_admin.initialize_app(None, {
    'databaseURL': 'https://wash-264217.firebaseio.com/'
})
root = db.reference()


def get_bookings_for_year(year):
    bookings_in_year = db.reference('bookings').order_by_key().start_at(year).get()
    return bookings_in_year


def get_bookings_for_date(date):
    booking = db.reference('bookings/{}'.format(date)).get()
    return booking if booking is not None else []


def insert_booking(date, from_timestamp, to_timestamp, email, username):
    if from_timestamp >= to_timestamp:
        raise Exception({"code": "bad_request",
                         "description":
                             "Booking start time is higher or equal to end time"}, 400)

    bookings_for_date = get_bookings_for_date(date)
    if bookings_for_date is None:
        bookings_for_date = []

    overlapping_bookings = bookings_with_overlapping_time_span(bookings_for_date, from_timestamp, to_timestamp)
    if len(overlapping_bookings) is not 0:
        raise Exception({"code": "bad_request",
                         "description":
                             "Bookings are not allowed to overlap"}, 400)

    insert = {
        'from': from_timestamp,
        'to': to_timestamp,
        'user': username,
        'id': str(uuid.uuid4()),
        'email': email,
    }
    bookings_for_date.append(insert)
    return insert_bookings(bookings_for_date, date)


def insert_bookings(bookings, date):
    db.reference('bookings/{}'.format(date)).set(bookings)
    return bookings


def bookings_with_overlapping_time_span(bookings, from_timespan, to_timestamp):
    return list(filter(lambda booking: booking["to"] > from_timespan and booking["from"] < to_timestamp, bookings))


def delete_booking(booking_id, date, username):
    bookings = get_bookings_for_date(date)
    matching_booking = list(filter(lambda booking: 'id' in booking and booking["id"] == booking_id, bookings))

    if len(matching_booking) == 0:
        raise Exception({"code": "not_found",
                         "description": f"Booking with id: {booking_id} on date: {date} was not found"}, 404)
    if matching_booking[0]['user'] != username:
        raise Exception({"code": "unauthorized",
                         "description": f"Booking with id: {booking_id} was not made by your user"}, 401)

    non_matching_bookings = list(filter(lambda booking: 'id' not in booking or booking["id"] != booking_id, bookings))
    return insert_bookings(non_matching_bookings, date)

