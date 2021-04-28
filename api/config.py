import os
from datetime import timedelta

class Config(object):
    SECRET_KEY = os.environ.get('SECRET_KEY') or "default-secret-key"

    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    JWT_TOKEN_LOCATION = ["cookies"]
    JWT_COOKIE_SECURE = True
    JWT_SECRET_KEY = os.environ.get('SECRET_KEY') or "default-secret-key"
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
    JWT_CSRF_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"]

    UPLOAD_FOLDER = "/data/sounds"
    MAX_CONTENT_LENGTH = 1024 * 1024

    ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD') or 'adminpassword'

    MUMBLE_BOT_IP = os.environ.get('MUMBLE_BOT_IP')
    MUMBLE_BOT_PORT = int(os.environ.get('MUMBLE_BOT_PORT')) or 64738
    MUMBLE_BOT_USERNAME = os.environ.get('MUMBLE_BOT_USERNAME') or 'MumbleSoundboard'
    MUMBLE_BOT_TIMEOUT_SECONDS = int(os.environ.get('MUMBLE_BOT_TIMEOUT_SECONDS')) or 10
    MAX_SOUND_DURATION = os.environ.get('MAX_SOUND_DURATION') or '20'
