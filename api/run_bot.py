from threading import Thread

from bot import app, sound_queue
from bot.mumble import MumbleBot

mumble_bot = MumbleBot(sound_queue, app)

t1 = Thread(target=mumble_bot.run)
t1.start()

serverThreading = Thread(target=app.run(host="0.0.0.0", debug=True))
serverThreading.start()
