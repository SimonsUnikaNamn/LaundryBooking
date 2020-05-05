import flask
import pytest

import main


# Create a fake "app" for generating test request contexts.
@pytest.fixture(scope="module")
def app():
    return flask.Flask(__name__)


def test_hello_get(app):
    with app.test_request_context():
        request = flask.request

        res = main.insert_booking_request(flask.request)
        assert 'Hello World!' in res
