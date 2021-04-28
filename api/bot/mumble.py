import os
import subprocess as sp
import time
import pymumble_py3 as pymumble


class MumbleBot:

    def __init__(self, queue, app):
        self.queue = queue
        self.app = app
        self.mumble = pymumble.Mumble(self.app.config['MUMBLE_BOT_IP'], self.app.config['MUMBLE_BOT_USERNAME'],
                                      port=self.app.config['MUMBLE_BOT_PORT'])
        self.skip = False

    def message_received(self, message):
        if "skip" in message.message.strip().lower():
            self.skip = True

    def run(self):
        self.mumble.start()
        self.mumble.is_ready()
        self.mumble.callbacks.set_callback(pymumble.constants.PYMUMBLE_CLBK_TEXTMESSAGERECEIVED, self.message_received)

        while True:
            if self.queue.not_empty:
                queue_object = self.queue.get()
                username = queue_object.get("name")

                for user in self.mumble.users.values():
                    if user.get_property('name') == username:
                        self.mumble.users.myself.move_in(user.get_property('channel_id'))

                file = os.path.join(self.app.config['UPLOAD_FOLDER'], queue_object.get("sound_id"))
                command = ["ffmpeg", "-i", file, "-t", self.app.config['MAX_SOUND_DURATION'], "-acodec", "pcm_s16le",
                           "-f",
                           "s16le", "-ab", "192k", "-ac", "1", "-ar", "48000", "-"]
                sound = sp.Popen(command, stdout=sp.PIPE, stderr=sp.DEVNULL, bufsize=1024)
                while True:
                    raw_music = sound.stdout.read(1024)
                    if not raw_music:
                        break
                    self.mumble.sound_output.add_sound(raw_music)
                while self.mumble.sound_output.get_buffer_size() > 0.5:  #
                    if self.skip:
                        self.mumble.sound_output.clear_buffer()
                        self.skip = False
                        break
                    time.sleep(0.01)
            else:
                time.sleep(0.1)
