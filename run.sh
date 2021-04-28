#!/bin/bash

echo "Running DB init"
python ./api/manage_bot.py db init

echo "Running DB migrate"
python ./api/manage_bot.py db migrate

echo "Running DB upgrade"
python ./api/manage_bot.py db upgrade

echo "Running app"
python ./api/run_bot.py