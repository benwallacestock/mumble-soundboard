from werkzeug.security import check_password_hash

from bot import db


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), index=True, unique=True)
    timeout = db.Column(db.DateTime)
    password_hash = db.Column(db.String(128))
    mumble_username = db.Column(db.String(128))
    admin = db.Column(db.Boolean, default=False)
    disabled = db.Column(db.Boolean, default=True)
    sounds = db.relationship('Sound', backref='owner', lazy='dynamic')
    sound_board_sounds = db.relationship('Sound', secondary='sound_board')

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)


class Sound(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    sound_name = db.Column(db.String(20), index=True)
    file_uuid = db.Column(db.String(36), index=True, unique=True)
    private = db.Column(db.Boolean)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    users = db.relationship('User', secondary='sound_board')


class SoundBoard(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    sound_id = db.Column(db.Integer, db.ForeignKey('sound.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
