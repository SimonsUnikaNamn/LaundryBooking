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
    return booking


def insert_booking(date, from_timestamp, to_timestamp, username):
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
    }
    bookings_for_date.append(insert)
    db.reference('bookings/{}'.format(date)).set(bookings_for_date)
    return bookings_for_date


def bookings_with_overlapping_time_span(bookings, from_timespan, to_timestamp):
    return list(filter(lambda booking: booking["to"] >= from_timespan and booking["from"] <= to_timestamp, bookings))