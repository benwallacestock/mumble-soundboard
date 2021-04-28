from flask_migrate import Migrate, MigrateCommand
from flask_script import Manager

from bot import app, db

db.init_app(app)

MIGRATION_DIR = '/data/migrations'

migrate = Migrate(app, db, directory=MIGRATION_DIR)
manager = Manager(app)

manager.add_command('db', MigrateCommand)
manager.add_command('seed', MigrateCommand)


if __name__ == '__main__':
    manager.run()