from queue import Queue

from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy

from config import Config

app = Flask(__name__, static_folder='../../spa/dist', static_url_path='/')
app.config.from_object(Config)
CORS(app)
jwt = JWTManager(app)
db = SQLAlchemy(app)
migrate = Migrate(app, db)
sound_queue = Queue()

from bot import routes, models
