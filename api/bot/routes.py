import os
from datetime import datetime, timezone, timedelta
from sqlalchemy import or_, desc
from werkzeug.security import generate_password_hash
from bot import app, jwt, db, sound_queue
from flask import request, send_from_directory
from flask import jsonify
from flask_jwt_extended import create_access_token, get_jwt, get_jwt_identity, set_access_cookies, unset_jwt_cookies
from flask_jwt_extended import current_user
from flask_jwt_extended import jwt_required
from uuid import uuid4
import json
from bot.models import User, Sound


@jwt.user_lookup_loader
def user_lookup_callback(_jwt_header, jwt_data):
    identity = jwt_data["sub"]
    return User.query.filter_by(id=identity).one_or_none()


@app.before_first_request
def create_admin():
    admin_user = User.query.filter_by(username="admin").one_or_none()

    if not admin_user:
        admin_user = User(username="admin")
        db.session.add(admin_user)

    admin_user.password_hash = generate_password_hash(app.config['ADMIN_PASSWORD'])
    admin_user.admin = True
    admin_user.disabled = False
    db.session.commit()


@app.route('/')
@app.route('/upload')
@app.route('/sounds')
@app.route('/login')
@app.route('/user')
@app.route('/admin')
def index():
    return app.send_static_file('index.html')


@app.route('/favicon.ico')
def favicon():
    app.logger.error(app.root_path)
    return send_from_directory(os.path.join(app.root_path, 'static'),
                               'favicon.ico', mimetype='image/vnd.microsoft.icon')


@app.route("/api/signup", methods=["POST"])
def post_signup():
    username = request.json.get("username", None)
    password = request.json.get("password", None)
    confirm_password = request.json.get("confirm_password", None)

    if not username or len(username) > 64:
        return "Username must be at most 64 characters", 400

    if not password or len(password) < 8:
        return "Password must be at least 8 characters", 400

    if password != confirm_password:
        return "Passwords do not match", 400

    user = User.query.filter_by(username=username).one_or_none()
    if user:
        return "User with that name already exists", 400

    user = User(username=username, password_hash=generate_password_hash(password))
    db.session.add(user)
    db.session.commit()

    access_token = create_access_token(identity=user.id)
    response = jsonify(id=user.id, username=user.username, admin=user.admin, disabled=user.disabled)
    set_access_cookies(response, access_token)
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response


@app.route("/api/login", methods=["POST"])
def post_login():
    username = request.json.get("username", None)
    password = request.json.get("password", None)

    user = User.query.filter_by(username=username).one_or_none()
    if not user or not user.check_password(password):
        return "Incorrect username or password", 400

    # Notice that we are passing in the actual sqlalchemy user object here
    access_token = create_access_token(identity=user.id)
    response = jsonify(id=user.id, username=user.username, admin=user.admin, disabled=user.disabled)
    set_access_cookies(response, access_token)
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response


@app.route("/api/logout", methods=["POST"])
def post_logout():
    response = jsonify("Logged out")
    unset_jwt_cookies(response)
    return response


@app.route('/api/user', methods=["DELETE"])
@jwt_required()
def delete_user():
    if not current_user.admin:
        return "Account is not administrator", 403

    user_id = request.json.get("id", None)

    user = User.query.get(user_id)

    if not user:
        return "User not found", 400

    if user.username == 'admin':
        return "Can not delete admin user", 403

    for sound in user.sounds:
        db.session.delete(sound)

    db.session.delete(user)
    db.session.commit()
    return "User deleted successfully"


@app.route('/api/user', methods=["PUT"])
@jwt_required()
def put_user():
    return "User deleted successfully"


@app.route('/api/user/me', methods=["GET"])
@jwt_required()
def get_user_me():
    return jsonify(id=current_user.id, username=current_user.username, admin=current_user.admin,
                   disabled=current_user.disabled, mumble_username=current_user.mumble_username)


@app.route('/api/user/mumble_username', methods=["POST"])
@jwt_required()
def update_mumble_username():
    if current_user.disabled and not current_user.admin:
        return "Account is disabled", 403

    mumble_username = request.json.get("mumble_username", None)

    if len(mumble_username) > 128:
        return "Mumble username must be at most 128 characters", 400

    current_user.mumble_username = mumble_username
    db.session.commit()
    return "Mumble username successfully updated"


@app.route('/api/user/password', methods=["POST"])
@jwt_required()
def update_password():
    if current_user.disabled and not current_user.admin:
        return "Account is disabled", 403

    old_password = request.json.get("old_password", None)
    new_password = request.json.get("new_password", None)
    confirm_new_password = request.json.get("confirm_new_password", None)

    if not old_password or not current_user.check_password(old_password):
        return "Old password is incorrect", 400

    if not new_password or len(new_password) < 8:
        return "Password must be at least 8 characters", 400

    if new_password != confirm_new_password:
        return "Passwords do not match", 400

    current_user.password_hash = generate_password_hash(new_password)
    db.session.commit()
    return "Password successfully updated"


@app.route('/api/user/update/disabled', methods=["POST"])
@jwt_required()
def user_update_disabled():
    if not current_user.admin:
        return "Account is not administrator", 403

    user_id = request.json.get("id", None)
    state = request.json.get("state", None)

    user = User.query.get(user_id)

    if not user:
        return "User not found", 400

    if user.username == 'admin':
        return "Can not disable admin user", 403

    user.disabled = state
    db.session.commit()
    return "User disabled state changed successfully"


@app.route('/api/user/update/admin', methods=["POST"])
@jwt_required()
def user_update_admin():
    if not current_user.admin:
        return "Account is not administrator", 403

    user_id = request.json.get("id", None)
    state = request.json.get("state", None)

    user = User.query.get(user_id)

    if not user:
        return "User not found", 400

    if user.username == 'admin':
        return "Can not edit admin user", 403

    user.admin = state
    db.session.commit()
    return "User admin state changed successfully"


@app.route('/api/users', methods=["GET"])
@jwt_required()
def get_users():
    if not current_user.admin:
        return "Account is not admin", 403

    users = User.query.all()

    formatted_users = []

    for user in users:
        formatted_users.append(
            {'id': user.id, 'username': user.username, 'admin': user.admin,
             'disabled': user.disabled, 'mumble_username': user.mumble_username})

    return jsonify(users=formatted_users)


@app.route('/api/sounds', methods=["GET"])
@jwt_required()
def get_sounds():
    if current_user.disabled and not current_user.admin:
        return "Account is disabled", 403

    sounds = Sound.query.filter(or_(Sound.owner == current_user, Sound.private == False)).order_by(
        desc(Sound.file_uuid))

    formatted_sounds = []

    for sound in sounds:
        formatted_sounds.append(
            {'name': sound.sound_name, 'uuid': sound.file_uuid, 'is_owner': sound.owner == current_user,
             'owner_name': sound.owner.username, 'active': current_user in sound.users, 'private': sound.private})

    return jsonify(sounds=formatted_sounds)


@app.route('/api/sound', methods=["POST"])
@jwt_required()
def post_sound():
    if current_user.disabled and not current_user.admin:
        return "Account is disabled", 403

    data = json.loads(request.form['data'])
    file = request.files['file']

    sound_name = data['name']
    if sound_name is None or len(sound_name) > 20:
        return "Invalid sound name", 400

    sound = Sound.query.filter(Sound.sound_name.ilike(sound_name)).one_or_none()
    if sound:
        return "Sound with that name already exists", 400

    if file:
        mimetype = file.content_type
        if not mimetype.startswith('audio/'):
            return "File type not supported", 400
        uuid = str(uuid4())
        upload_folder = app.config['UPLOAD_FOLDER']
        if not os.path.exists(upload_folder):
            os.makedirs(upload_folder)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], str(uuid)))
        sound = Sound(sound_name=data['name'], file_uuid=uuid, owner=current_user, private=data['private'])
        current_user.sound_board_sounds.append(sound)
        db.session.add(sound)
        db.session.commit()
        return jsonify(sound_id=uuid)
    else:
        return "UploadSound did not include a file", 400


@app.route('/api/sound', methods=["PUT"])
@jwt_required()
def put_sound():
    if current_user.disabled and not current_user.admin:
        return "Account is disabled", 403

    uuid = request.json.get("uuid", None)

    sound = Sound.query.filter_by(file_uuid=uuid).one_or_none()
    if not sound:
        return "Sound does not exits", 400

    if sound.owner.id is not current_user.id:
        return "Permission denied", 403

    if request.json.get("private", None):
        if current_user in sound.users:
            sound.users = [current_user]
        else:
            sound.users = []

    sound.sound_name = request.json.get("name", None)
    sound.private = request.json.get("private", None)
    db.session.commit()
    return "Sound successfully updated"


@app.route('/api/sound', methods=["DELETE"])
@jwt_required()
def delete_sound():
    if current_user.disabled and not current_user.admin:
        return "Account is disabled", 403

    uuid = request.json.get("uuid", None)

    sound = Sound.query.filter_by(file_uuid=uuid).one_or_none()
    if not sound:
        return "Sound does not exits", 400

    if sound.owner.id is not current_user.id:
        return "Permission denied", 403

    os.remove(os.path.join(app.config['UPLOAD_FOLDER'], str(uuid)))
    db.session.delete(sound)
    db.session.commit()
    return "Sound deleted"


@app.route('/api/sound/queue', methods=["POST"])
@jwt_required()
def post_sound_queue():
    if current_user.disabled and not current_user.admin:
        return "Account is disabled", 403

    sound = Sound.query.filter_by(file_uuid=request.json.get("soundId")).one_or_none()

    if sound is None:
        return "This sound does not exist", 400

    if sound.owner.id is not current_user.id and sound.private:
        return "Permission denied", 403

    now = datetime.now()

    if current_user.timeout and current_user.timeout > now:
        return "Timed out for " + str((current_user.timeout - now).seconds) + " seconds", 403

    sound_queue.put({"name": current_user.mumble_username, "sound_id": request.json.get("soundId")})
    current_user.timeout = datetime.now() + timedelta(seconds=app.config['MUMBLE_BOT_TIMEOUT_SECONDS'])
    db.session.commit()
    return "Sound successfully queued"


@app.route('/api/soundboard', methods=["GET"])
@jwt_required()
def get_soundboard():
    if current_user.disabled and not current_user.admin:
        return "Account is disabled", 403

    sounds = current_user.sound_board_sounds

    formatted_sounds = []

    for sound in sounds:
        formatted_sounds.append(
            {'name': sound.sound_name, 'uuid': sound.file_uuid, 'is_owner': sound.owner == current_user,
             'owner_name': sound.owner.username, 'active': current_user in sound.users})

    return jsonify(sounds=formatted_sounds)


@app.route('/api/soundboard', methods=["PUT"])
@jwt_required()
def put_soundboard():
    if current_user.disabled and not current_user.admin:
        return "Account is disabled", 403

    state = request.json.get("state", None)
    uuid = request.json.get("uuid", None)

    sound = Sound.query.filter(Sound.file_uuid == uuid).first()

    if sound.owner.id is not current_user.id and sound.private:
        return "Permission denied", 403

    if state:
        current_user.sound_board_sounds.append(sound)

    else:
        current_user.sound_board_sounds.remove(sound)

    db.session.commit()

    return "Soundboard updated"


@app.after_request
def refresh_expiring_jwts(response):
    try:
        exp_timestamp = get_jwt()["exp"]
        now = datetime.now(timezone.utc)
        target_timestamp = datetime.timestamp(now + timedelta(minutes=30))
        if target_timestamp > exp_timestamp:
            access_token = create_access_token(identity=get_jwt_identity())
            set_access_cookies(response, access_token)
        return response
    except (RuntimeError, KeyError):
        return response
