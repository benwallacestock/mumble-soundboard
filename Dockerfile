FROM nikolaik/python-nodejs:latest

RUN apt-get -y update
RUN apt-get -y upgrade
RUN apt-get -y install opus-tools ffmpeg

WORKDIR /usr/src/app

COPY requirements.txt ./
COPY run.sh ./
RUN chmod +x run.sh

RUN pip install --no-cache-dir -r requirements.txt

COPY ./spa ./spa
COPY ./api ./api

RUN npm --prefix ./spa install ./spa
RUN npm --prefix ./spa run build

ENTRYPOINT ["./run.sh"]