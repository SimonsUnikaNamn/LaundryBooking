import flask
import pytest

import main


# Create a fake "app" for generating test request contexts.
@pytest.fixture(scope="module")
def app():
    return flask.Flask(__name__)


def test_hello_get(app):
    with app.test_request_context():
        res = main.hello_get(flask.request)
        assert 'Hello World!' in res
